import * as ex from 'excalibur';
import { Ship, ShipEvents, ShipStoppedEvent } from '../actors/ship';
import { MyLevel } from '../scenes/level';
import { ShipTarget } from './autopilot';

import { StaticSpaceObject } from '../actors/StaticSpaceObject';
import { StationComponent } from './station';

export class AutoscoutComponent extends ex.Component {
    declare owner: Ship;
    declare level: MyLevel;

    topNObjects: number = 1;
    rememberNObjects: number = 1;
    initialRangeMultiplier: number = 1;
    rangeMultiplier: number = 0;
    excludeTargets: ex.Actor[] = [];
    enabled: boolean = true;

    target: ex.Actor | null = null;

    machine = ex.StateMachine.create({
        start: 'IDLE',
        states: {
          IDLE: {
            onUpdate: this.onIdleUpdate.bind(this),
            transitions: ['FIND_OBJECT']
          },
          FIND_OBJECT: {
            onEnter: this.onFindObjectEnter.bind(this),
            onUpdate: this.onFindObjectUpdate.bind(this),
            onExit: this.resetRangeMultiplier.bind(this),
            transitions: ['IDLE']
          },
        }
    })

    constructor(level: MyLevel, topNObjects: number = 1, rememberNObjects: number = 1, initialRangeMultiplier: number = 1) {
        super();
        this.level = level;
        this.topNObjects = topNObjects;
        this.rememberNObjects = rememberNObjects;
        this.initialRangeMultiplier = initialRangeMultiplier;
    }

    onAdd(owner: ex.Actor): void {
        this.owner.events.on(ShipEvents.Stopped, (evt: ShipStoppedEvent) => {
            this.onStoppedAt(evt.where);
        });

        const timer = new ex.Timer({
            action: () => {
                if (!this.enabled || this.owner.motionSystem.paused) {
                    return;
                }
                this.machine.update(timer.interval);
            },
            repeats: true,
            interval: 1000,
            random: this.level.random,
            randomRange: [-200, 200],
          })
        this.level.engine.currentScene.add(timer)
        this.machine.update(1000); // first call immediately
        timer.start()
    }

    getDetails(): string {
        return `${this.machine.currentState.name} ${this.rangeMultiplier > 0 ? `(range ${this.rangeMultiplier}x)` : ''}`;
    }

    onIdleUpdate(_data: unknown, elapsed: number) {
        // console.log(this.owner.name, 'idle', elapsed);
        this.machine.go('FIND_OBJECT');
    }

    onFindObjectEnter() {
        // console.log(this.owner.name, 'find object');
        this.rangeMultiplier = this.initialRangeMultiplier;
        if (this.target) {
            this.excludeTargets.push(this.target);
        }
        // keep only the last N objects
        this.excludeTargets = this.excludeTargets.slice(-this.rememberNObjects);
        this.target = null;
    }

    resetRangeMultiplier() {
        this.rangeMultiplier = 0;
    }

    onFindObjectUpdate(_data: unknown, elapsed: number) {
        if (this.target) {
            return;
        }
        const candidates = this.getNearbyObjects();
        if (candidates.length === 0) {
            // console.log(this.owner.name, 'no useful astroids in range, increasing range');
            this.rangeMultiplier += 1;
            return;
        }
        this.target = this.getNearbyStaticObject(candidates, this.topNObjects);
        this.owner.orderMoveTo(this.target);
    }

    getNearbyObjects(): StaticSpaceObject[] {
        const maxRange = this.rangeMultiplier * this.owner.sensorRadius;
        return this.level.staticObjects.filter(obj => obj.has(StationComponent) &&!this.excludeTargets.includes(obj) && this.owner.pos.distance(obj.pos) <= maxRange);
    }

    getNearbyStaticObject(candidates: StaticSpaceObject[], topN: number = 1): StaticSpaceObject {
        const sortedObjects = candidates.sort((a, b) => this.owner.pos.distance(a.pos) - this.owner.pos.distance(b.pos));
        return this.level.random.pickOne(sortedObjects.slice(0, topN));
    }

    onStoppedAt(where: ShipTarget) {
        if (!(where instanceof ex.Actor)) {
            return;
        }

        if (this.target !== where) {
            console.log(this.owner.name, 'target changed from', this.target, 'to', where);
            this.target = where;
        }

        this.machine.go('IDLE');
    }
}

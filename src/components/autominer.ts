import * as ex from 'excalibur';
import { Ship, ShipEvents, ShipStoppedEvent } from '../actors/ship';
import { MyLevel } from '../scenes/level';
import { CargoComponent } from './cargo';
import { StationComponent } from './station';
import { MinableComponent } from './minable';
import { ShipTarget } from './autopilot';

import { Wares } from '../data/wares';
import { StaticSpaceObject } from '../actors/StaticSpaceObject';
import { Config } from '../config';

export class AutominerComponent extends ex.Component {
    declare owner: Ship;
    declare level: MyLevel;

    mineAmount: number = 100;
    unloadThreshold: number = 0.5;
    topNAstroids: number = 5;
    topNStations: number = 2;

    initialRangeMultiplier: number = 2;
    rangeMultiplier: number = 0;
    excludeTargets: ex.Actor[] = [];

    enabled: boolean = true;
    target: ex.Actor | null = null;

    machine = ex.StateMachine.create({
        start: 'IDLE',
        states: {
          IDLE: {
            onUpdate: this.onIdleUpdate.bind(this),
            transitions: ['FIND_ASTROID', 'FIND_STATION']
          },
          FIND_ASTROID: {
            onEnter: this.onFindAstroidEnter.bind(this),
            onUpdate: this.onFindAstroidUpdate.bind(this),
            onExit: this.resetRangeMultiplier.bind(this),
            transitions: ['MINE_ASTROID', 'IDLE']
          },
          MINE_ASTROID: {
            onUpdate: this.onMineAstroidUpdate.bind(this),
            transitions: ['IDLE']
          },
          FIND_STATION: {
            onEnter: this.onFindStationEnter.bind(this),
            onUpdate: this.onFindStationUpdate.bind(this),
            onExit: this.resetRangeMultiplier.bind(this),
            transitions: ['DELIVER_CARGO', 'IDLE']
          },
          DELIVER_CARGO: {
            onUpdate: this.onDeliverCargoUpdate.bind(this),
            transitions: ['IDLE']
          },
        }
    })

    constructor(level: MyLevel, mineAmount: number = 100, unloadThreshold: number = 0.5, topNAstroids: number = 5, topNStations: number = 2, initialRangeMultiplier: number = 1) {
        super();
        this.level = level;
        this.mineAmount = mineAmount;
        this.unloadThreshold = unloadThreshold;
        this.topNAstroids = topNAstroids;
        this.topNStations = topNStations;
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
                // console.log('PING', this.owner.name, this.machine.currentState.name, timer.interval);
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
        const cargo = this.owner.get(CargoComponent);
        if (cargo.volume > cargo.maxVolume * this.unloadThreshold) {
            this.machine.go('FIND_STATION');
        } else {
            this.machine.go('FIND_ASTROID');
        }
    }

    onFindAstroidEnter() {
        // console.log(this.owner.name, 'find astroid');
        this.rangeMultiplier = this.initialRangeMultiplier;
        this.excludeTargets = [];
        if (this.target) {
            this.excludeTargets.push(this.target);
        }
        this.target = null;
    }

    resetRangeMultiplier() {
        this.rangeMultiplier = 0;
    }

    onFindAstroidUpdate(_data: unknown, elapsed: number) {
        if (this.target) {
            if (!this.target.get(MinableComponent)?.amount) {
                this.owner.orderCoast();
                this.onFindAstroidEnter();
            } else {
                return;
            }
        }
        const candidates = this.getNearbyAstroids();
        if (candidates.length === 0) {
            // console.log(this.owner.name, 'no useful astroids in range, increasing range');
            this.rangeMultiplier = Math.min(this.rangeMultiplier * 2, Config.MaxRangeMultiplier);
            return;
        }
        this.target = this.getNearbyStaticObject(candidates, this.topNAstroids);
        this.owner.orderMoveTo(this.target);
    }

    getNearbyAstroids(): StaticSpaceObject[] {
        const maxRange = this.rangeMultiplier * this.owner.sensorRadius;
        const cargo = this.owner.get(CargoComponent);
        return this.level.staticObjects.filter(obj => obj.has(MinableComponent) && cargo.resourceFilter.includes(obj.get(MinableComponent)?.type) && !this.excludeTargets.includes(obj) && this.owner.pos.distance(obj.pos) <= maxRange && obj.get(MinableComponent)?.amount >= this.mineAmount);
    }

    onFindStationEnter() {
        // console.log(this.owner.name, 'find station');
        this.rangeMultiplier = this.initialRangeMultiplier;
        this.excludeTargets = [];
        if (this.target) {
            this.excludeTargets.push(this.target);
        }
        this.target = null;
    }

    onFindStationUpdate(_data: unknown, elapsed: number) {
        if (this.target) {
            const shipCargo = this.owner.get(CargoComponent);
            const station = this.target.get(StationComponent);
            if (!Object.keys(shipCargo.items).some(item => station.calcMaxBuyAmount(item as Wares) > 0)) {
                this.owner.orderCoast();
                this.onFindStationEnter();
            } else {
                return;
            }
        }
        const candidates = this.getNearbyStations();
        if (candidates.length === 0) {
            // console.log(this.owner.name, 'no useful stations in range, increasing range');
            this.rangeMultiplier = Math.min(this.rangeMultiplier * 2, Config.MaxRangeMultiplier);
            return;
        }
        this.target = this.getNearbyStaticObject(candidates, this.topNStations);
        this.owner.orderMoveTo(this.target);
    }

    getNearbyStations(): StaticSpaceObject[] {
        const maxRange = this.rangeMultiplier * this.owner.sensorRadius;
        const shipCargo = this.owner.get(CargoComponent);
        return this.level.staticObjects.filter(
            obj => obj.has(StationComponent)
            && !this.excludeTargets.includes(obj)
            && this.owner.pos.distance(obj.pos) <= maxRange
            && Object.keys(shipCargo.items).some(item => obj.get(StationComponent)?.getPriceQuote(item as Wares) > 0 && obj.get(StationComponent)?.calcMaxBuyAmount(item as Wares) > 0));
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

        // const cargo = this.owner.get(CargoComponent);
        if (where.has(StationComponent)) {
            // console.log(this.owner.name, 'stopped at station');
            this.machine.go('DELIVER_CARGO');
        } else if (where.has(MinableComponent)) {
            // console.log(this.owner.name, 'stopped at astroid');
            this.machine.go('MINE_ASTROID');
        } else {
            console.warn(this.owner.name, 'stopped at unknown target');
        }
    }

    onMineAstroidUpdate(_data: unknown, elapsed: number) {
        if (!(this.target instanceof ex.Actor) || !(this.target.has(MinableComponent))) {
            this.machine.go('IDLE');
            return;
        }
        // console.log(this.owner.name, 'mine astroid', elapsed);

        const minable = this.target.get(MinableComponent);
        const cargo = this.owner.get(CargoComponent);
        const maxCargoAmount = cargo.getAvailableSpaceFor(minable.type);
        const amount = Math.floor(Math.min(this.mineAmount * elapsed / 1000, maxCargoAmount, minable.amount));
        if (amount > 0) {
            // console.log(this.owner.name, 'stopped at astroid', minable.type, 'and mined', amount, 'of', minable.amount);
            cargo.addItem(minable.type, amount);
            minable.amount -= amount;
        } else {
            this.machine.go('IDLE');
        }
    }

    onDeliverCargoUpdate(_data: unknown, elapsed: number) {
        if (!(this.target instanceof ex.Actor) || !(this.target.has(CargoComponent))) {
            this.machine.go('IDLE');
            return;
        }
        // console.log(this.owner.name, 'deliver cargo', elapsed);
        const station = this.target.get(StationComponent);
        const stationCargo = this.target.get(CargoComponent);
        const hasTraded = station.sellAllCargoToStation(this.owner, this.target, stationCargo.resourceFilter, elapsed);
        if (!hasTraded) {
            this.machine.go('IDLE');
        }
    }
}

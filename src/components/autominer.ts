import * as ex from 'excalibur';
import { PausableMotionSystem } from '../systems/PausableMotionSystem';
import { Ship, ShipEvents, ShipStoppedEvent } from '../actors/ship';
import { MyLevel } from '../scenes/level';
import { CargoComponent } from './cargo';
import { StationComponent } from './station';
import { MinableComponent } from './minable';
import { ShipTarget } from './autopilot';

import { WaresType } from '../data/wares';

export class AutominerComponent extends ex.Component {
    declare owner: Ship;
    declare level: MyLevel;

    mineAmount: number = 100;
    unloadThreshold: number = 0.5;
    topNAstroids: number = 5;
    topNStations: number = 2;

    enabled: boolean = true;
    target: ex.Actor | null = null;
    motionSystem!: PausableMotionSystem;

    machine = ex.StateMachine.create({
        start: 'IDLE',
        states: {
          IDLE: {
            onUpdate: this.onIdleUpdate.bind(this),
            transitions: ['FIND_ASTROID', 'FIND_STATION']
          },
          FIND_ASTROID: {
            onEnter: this.onFindAstroidEnter.bind(this),
            transitions: ['MINE_ASTROID', 'IDLE']
          },
          MINE_ASTROID: {
            onUpdate: this.onMineAstroidUpdate.bind(this),
            transitions: ['IDLE']
          },
          FIND_STATION: {
            onEnter: this.onFindStationEnter.bind(this),
            transitions: ['DELIVER_CARGO', 'IDLE']
          },
          DELIVER_CARGO: {
            onUpdate: this.onDeliverCargoUpdate.bind(this),
            transitions: ['IDLE']
          },
        }
    })

    constructor(level: MyLevel, mineAmount: number = 100, unloadThreshold: number = 0.5, topNAstroids: number = 5, topNStations: number = 2) {
        super();
        this.level = level;
        this.mineAmount = mineAmount;
        this.unloadThreshold = unloadThreshold;
        this.topNAstroids = topNAstroids;
        this.topNStations = topNStations;
    }

    onAdd(owner: ex.Actor): void {
        owner.on('initialize', (evt: ex.InitializeEvent) => {
            this.motionSystem = evt.engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
        })

        this.owner.events.on(ShipEvents.Stopped, (evt: ShipStoppedEvent) => {
            this.onStoppedAt(evt.where);
        });

        const timer = new ex.Timer({
            action: () => {
                if (!this.enabled || this.motionSystem.paused) {
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
        return `${this.machine.currentState.name}`;
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
        this.target = this.level.getNearbyStaticObjectWithComponent(this.owner, MinableComponent, this.topNAstroids, this.target);
        this.owner.orderMoveTo(this.target);
    }

    onFindStationEnter() {
        // console.log(this.owner.name, 'find station');
        this.target = this.level.getNearbyStaticObjectWithComponent(this.owner, StationComponent, this.topNStations, this.target);
        this.owner.orderMoveTo(this.target);
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
        const stationCargo = this.target.get(CargoComponent);
        const shipCargo = this.owner.get(CargoComponent);
        for (const [item, amount] of Object.entries(shipCargo.items)) {
            const space = stationCargo.getAvailableSpaceFor(item as WaresType);
            const transferAmount = Math.min(space, amount);
            if (transferAmount > 0) {
                stationCargo.addItem(item as WaresType, transferAmount);
                shipCargo.removeItem(item as WaresType, transferAmount);
                // console.log(this.owner.name, 'transferred', transferAmount, 'of', item, 'to station');
            } else {
                console.log(this.owner.name, 'no space at station for', item, 'so stopping transfer');
                break;
            }
        }
        this.machine.go('IDLE');
    }
}

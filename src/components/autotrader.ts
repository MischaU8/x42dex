import * as ex from 'excalibur';
import { Ship, ShipEvents, ShipStoppedEvent } from '../actors/ship';
import { MyLevel } from '../scenes/level';
import { CargoComponent } from './cargo';
import { StationComponent } from './station';
import { ShipTarget } from './autopilot';

import { Wares } from '../data/wares';
import { StaticSpaceObject } from '../actors/StaticSpaceObject';
import { Config } from '../config';

export class AutotraderComponent extends ex.Component {
    declare owner: Ship;
    declare level: MyLevel;

    tradeFilter: Wares[] = [];
    topNSellers: number = 1;
    topNBuyers: number = 1;

    tradeProduct: Wares | null = null;
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
            transitions: ['FIND_SELLER', 'FIND_BUYER']
          },
          FIND_SELLER: {
            onEnter: this.onFindStationEnter.bind(this),
            onUpdate: this.onFindSellerUpdate.bind(this),
            onExit: this.resetRangeMultiplier.bind(this),
            transitions: ['TRADE_SELLER', 'IDLE']
          },
          TRADE_SELLER: {
            onUpdate: this.onTradeSellerUpdate.bind(this),
            transitions: ['IDLE']
          },
          FIND_BUYER: {
            onEnter: this.onFindStationEnter.bind(this),
            onUpdate: this.onFindBuyerUpdate.bind(this),
            onExit: this.resetRangeMultiplier.bind(this),
            transitions: ['TRADE_BUYER', 'IDLE']
          },
          TRADE_BUYER: {
            onUpdate: this.onTradeBuyerUpdate.bind(this),
            transitions: ['IDLE']
          },
        }
    })

    constructor(level: MyLevel, tradeFilter: Wares[], topNBuyers: number = 1, topNSellers: number = 1, initialRangeMultiplier: number = 2) {
        super();
        this.level = level;
        this.tradeFilter = tradeFilter;
        this.topNBuyers = topNBuyers;
        this.topNSellers = topNSellers;
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
        if (cargo.volume > 0) {
            this.tradeProduct = this.level.random.pickOne(Object.keys(cargo.items) as Wares[]);
            this.machine.go('FIND_BUYER');
        } else {
            this.tradeProduct = this.level.random.pickOne(this.tradeFilter);
            this.machine.go('FIND_SELLER');
        }
    }

    onFindStationEnter() {
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

    getNearbySellers(): StaticSpaceObject[] {
        const maxRange = this.rangeMultiplier * this.owner.sensorRadius;
        return this.level.staticObjects.filter(
            obj => obj.has(StationComponent)
            && !this.excludeTargets.includes(obj)
            && this.owner.pos.distance(obj.pos) <= maxRange
            && obj.get(CargoComponent)?.items[this.tradeProduct as Wares] > 0
            && obj.get(StationComponent)?.itemPrices[this.tradeProduct as Wares] > 0);
    }

    getNearbyBuyers(): StaticSpaceObject[] {
        const maxRange = this.rangeMultiplier * this.owner.sensorRadius;
        return this.level.staticObjects.filter(
            obj => obj.has(StationComponent)
            && !this.excludeTargets.includes(obj)
            && this.owner.pos.distance(obj.pos) <= maxRange
            && obj.get(StationComponent)?.calcMaxBuyAmount(this.tradeProduct as Wares)
            && obj.get(StationComponent)?.itemPrices[this.tradeProduct as Wares] > 0);
    }

    onFindSellerUpdate(_data: unknown, elapsed: number) {
        if (this.target) {
            if (!this.target.get(CargoComponent)?.items[this.tradeProduct as Wares]) {
                this.owner.orderCoast();
                this.onFindStationEnter();
            } else {
                return;
            }
        }
        const candidates = this.getNearbySellers();
        if (candidates.length === 0) {
            this.rangeMultiplier = Math.min(this.rangeMultiplier * 2, Config.MaxRangeMultiplier);
            return;
        }
        this.target = this.getBestSeller(candidates);
        if (this.target) {
            this.owner.orderMoveTo(this.target);
        } else {
            this.machine.go('IDLE');
        }
    }

    onFindBuyerUpdate(_data: unknown, elapsed: number) {
        if (this.target) {
            if (!this.target.get(StationComponent)?.calcMaxBuyAmount(this.tradeProduct as Wares)) {
                this.owner.orderCoast();
                this.onFindStationEnter();
            } else {
                return;
            }
        }
        const candidates = this.getNearbyBuyers();
        if (candidates.length === 0) {
            // console.log(this.owner.name, 'no useful stations in range, increasing range');
            this.rangeMultiplier = Math.min(this.rangeMultiplier * 2, Config.MaxRangeMultiplier);
            return;
        }
        this.target = this.getBestBuyer(candidates);
        if (this.target) {
            this.owner.orderMoveTo(this.target);
        } else {
            this.machine.go('IDLE');
        }
    }

    sortByPrice(candidates: StaticSpaceObject[]): StaticSpaceObject[] {
        return candidates.sort((a, b) => a.get(StationComponent)?.itemPrices[this.tradeProduct as Wares] - b.get(StationComponent)?.itemPrices[this.tradeProduct as Wares]);
    }

    getBestBuyer(candidates: StaticSpaceObject[]): StaticSpaceObject | null {
        const sortedObjects = this.sortByPrice(candidates);
        return this.level.random.pickOne(sortedObjects.slice(-this.topNBuyers));
    }

    getBestSeller(candidates: StaticSpaceObject[]): StaticSpaceObject | null {
        const sortedObjects = this.sortByPrice(candidates);
        return this.level.random.pickOne(sortedObjects.slice(0, this.topNSellers));
    }

    onStoppedAt(where: ShipTarget) {
        if (!(where instanceof ex.Actor)) {
            return;
        }

        if (this.target !== where) {
            console.log(this.owner.name, 'target changed from', this.target, 'to', where);
            this.target = where;
        }

        if (where.has(StationComponent)) {
            const cargo = this.owner.get(CargoComponent);
            if (cargo.volume > 0) {
                this.machine.go('TRADE_BUYER');
            } else {
                this.machine.go('TRADE_SELLER');
            }
        } else {
            console.warn(this.owner.name, 'stopped at unknown target');
        }
    }

    onTradeSellerUpdate(_data: unknown, elapsed: number) {
        if (!(this.target instanceof ex.Actor) || !(this.target.has(StationComponent))) {
            this.machine.go('IDLE');
            return;
        }
        const station = this.target.get(StationComponent);
        const hasTraded = station.tradeAllCargo(this.target, this.owner, this.tradeFilter, elapsed);
        if (!hasTraded) {
            this.machine.go('IDLE');
        }
    }

    onTradeBuyerUpdate(_data: unknown, elapsed: number) {
        if (!(this.target instanceof ex.Actor) || !(this.target.has(StationComponent))) {
            this.machine.go('IDLE');
            return;
        }
        // console.log(this.owner.name, 'deliver cargo', elapsed);
        const station = this.target.get(StationComponent);
        const hasTraded = station.tradeAllCargo(this.owner, this.target, this.tradeFilter, elapsed);
        if (!hasTraded) {
            this.machine.go('IDLE');
        }
    }
}

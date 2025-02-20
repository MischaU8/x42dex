import * as ex from 'excalibur';
import { PausableMotionSystem } from '../systems/PausableMotionSystem';
import { Config } from '../config';
import { Ship, ShipEvents } from '../actors/ship';
import { MyLevel } from '../scenes/level';
import { CargoComponent } from './cargo';
import { StationComponent } from './station';
import { MinableComponent } from './minable';

export class AutominerComponent extends ex.Component {
    declare owner: Ship;
    declare level: MyLevel;

    enabled: boolean = true;
    target: ex.Vector | ex.Actor = ex.Vector.Zero;
    motionSystem!: PausableMotionSystem;

    constructor(level: MyLevel) {
        super();
        this.level = level;
    }

    onAdd(owner: ex.Actor): void {
        owner.on('initialize', (evt: ex.InitializeEvent) => {
            this.motionSystem = evt.engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
        })

        this.owner.events.on(ShipEvents.Stopped, () => {
            this.update();
        });

        this.travelToAstroid();
    }

    update() {
        if (!this.enabled || this.motionSystem.paused) {
            return;
        }

        const cargo = this.owner.get(CargoComponent);
        if (cargo.volume > 0) {
            // console.log('Ship', ship.name, 'stopped at station');
            cargo.volume = 0;
            this.travelToAstroid();
        } else {
            // console.log('Ship', ship.name, 'stopped at astroid');
            cargo.volume = Config.MaxCargo;
            this.travelToStation();
        }
    }

    travelToAstroid() {
        const target = this.level.getRandomStaticObjectWithComponent(MinableComponent);
        this.owner.orderMoveTo(target);
    }

    travelToStation() {
        const target = this.level.getRandomStaticObjectWithComponent(StationComponent);
        this.owner.orderMoveTo(target);
    }
}

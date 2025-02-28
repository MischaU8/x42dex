import * as gev from "../gameevents";

import { Map } from "../actors/map";
import { Ship } from "../actors/ship";
import { CargoComponent } from "../components/cargo";
import { ShipConfig } from "../data/ships";
import { MyLevel } from "../scenes/level";
import { WalletComponent } from "../components/wallet";
import { AutominerComponent } from "../components/autominer";
import { AutopilotComponent } from "../components/autopilot";
import { AutoscoutComponent } from "../components/autoscout";

export class ShipFactory {
    constructor(
        private scene: MyLevel,
        private random: ex.Random,
        private map: Map
    ) {}

    createShip(config: ShipConfig): Ship {
        const shipImage = this.random.pickOne(config.possibleImages);
        const shipColor = this.random.pickOne(config.possibleColors);
        const ship = new Ship(
            `${config.name} ${config.index}`,
            shipImage,
            shipColor,
            this.map
        );

        this.addComponents(ship, config);
        this.bindEvents(ship);

        return ship;
    }

    private addComponents(ship: Ship, config: ShipConfig) {
        if (config.components.cargo) {
            const cargo = config.components.cargo;
            ship.addComponent(
                new CargoComponent(
                    cargo.maxVolume,
                    cargo.resourceFilter
                )
            );
        }
        if (config.components.wallet) {
            const wallet = config.components.wallet;
            ship.addComponent(
                new WalletComponent(wallet.initialBalance)
            );
        }
        if (config.components.autopilot) {
            ship.addComponent(new AutopilotComponent());
        }
        if (config.components.autominer) {
            const am = config.components.autominer;
            ship.addComponent(new AutominerComponent(this.scene,
                this.random.integer(am.minMineAmount!, am.maxMineAmount!),
                this.random.integer(am.minUnloadAmount!, am.maxUnloadAmount!),
                this.random.floating(am.minUnloadThreshold!, am.maxUnloadThreshold!),
                this.random.integer(am.minTopNAstroids!, am.maxTopNAstroids!),
                this.random.integer(am.minTopNStations!, am.maxTopNStations!),
                am.initialRangeMultiplier!
            ));
        }
        if (config.components.autoscout) {
            const as = config.components.autoscout;
            ship.addComponent(new AutoscoutComponent(this.scene,
                as.topNObjects,
                as.rememberNObjects,
                as.initialRangeMultiplier
            ));
        }
    }

    private bindEvents(ship: Ship) {
        ship.events.on(gev.MyActorEvents.Selected,
            (evt: gev.ActorSelectedEvent) => {
                this.scene.onSelectShip(evt.target as Ship);
            }
        );
        ship.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
            this.scene.onTargetShip(evt.target as Ship);
        });
    }
}

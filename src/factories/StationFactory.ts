import * as ex from "excalibur";
import * as gev from "../gameevents";

import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { StationComponent } from "../components/station";
import { CargoComponent } from "../components/cargo";
import { WalletComponent } from "../components/wallet";
import { MyLevel } from "../scenes/level";
import { Resources } from "../resources";
import { Config } from "../config";

export interface StationConfig {
    name: string;
    index: number;
    possibleImages?: ex.ImageSource[];
    possibleColors?: ex.Color[];
}

export class StationFactory {
    constructor(
        private scene: MyLevel,
        private random: ex.Random,
    ) {}

    createStation(config: StationConfig): StaticSpaceObject {
        const stationImage = this.random.pickOne(config.possibleImages || [Resources.StationA, Resources.StationB]);
        const stationColor = this.random.pickOne(config.possibleColors || [ex.Color.ExcaliburBlue, ex.Color.Teal]);

        const station = new StaticSpaceObject(
            `${config.name} ${config.index}`,
            stationImage,
            stationColor,
            ex.Vector.Zero
        );

        this.addComponents(station);
        this.bindEvents(station);

        return station;
    }

    private addComponents(station: StaticSpaceObject) {
        station.addComponent(new StationComponent(this.random));
        station.addComponent(new CargoComponent(Config.StationMaxVolume));
        station.addComponent(new WalletComponent(
            this.random.integer(Config.StationMinInitialBalance, Config.StationMaxInitialBalance)
        ));
    }

    private bindEvents(station: StaticSpaceObject) {
        station.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
            this.scene.onSelectStation(evt.target as StaticSpaceObject);
        });

        station.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
            this.scene.onTargetStation(evt.target as StaticSpaceObject);
        });
    }
}
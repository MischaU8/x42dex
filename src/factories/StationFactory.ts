import * as ex from "excalibur";
import * as gev from "../gameevents";

import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { StationComponent } from "../components/station";
import { CargoComponent } from "../components/cargo";
import { WalletComponent } from "../components/wallet";
import { MyLevel } from "../scenes/level";
import { Resources } from "../resources";
import { StationConfig } from "../data/stations";
import { ProductionComponent } from "../components/production";
import { Wares } from "../data/wares";

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

        this.addComponents(station, config);
        this.bindEvents(station);

        return station;
    }

    private addComponents(station: StaticSpaceObject, config: StationConfig) {
        const cargo = config.components?.cargo;
        if (cargo) {
            const cargoComponent = new CargoComponent(cargo.maxVolume, cargo.resourceFilter);
            if (cargo.startAmount) {
                for (const [resource, amount] of Object.entries(cargo.startAmount)) {
                    cargoComponent.addItem(resource as Wares, this.random.integer(amount.min, amount.max));
                }
            }
            station.addComponent(cargoComponent);
        }
        const wallet = config.components?.wallet;
        if (wallet) {
            station.addComponent(new WalletComponent(wallet.initialBalance));
        }
        station.addComponent(new StationComponent());
        const production = config.components?.production;
        if (production) {
            const productionComponent = new ProductionComponent(this.scene, production.jobs);
            station.addComponent(productionComponent);
            if (production.startJobs) {
                for (const job of productionComponent.productionJobs) {
                    job.running = true;
                    job.timeRemaining = this.random.integer(job.jobType.cycleTime * 0.1, job.jobType.cycleTime * 0.9);
                }
            }
        }
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
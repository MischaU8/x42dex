import * as ex from "excalibur";
import * as gev from "../gameevents";

import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { MinableComponent } from "../components/minable";
import { MyLevel } from "../scenes/level";
import { AstroidTypes, AstroidTypeKey } from "../data/astroids";
import { MinableWares } from "../data/wares";

export interface AstroidConfig {
    name: string;
    index: number;
    typeKey?: AstroidTypeKey;
}

export class AstroidFactory {
    constructor(
        private scene: MyLevel,
        private random: ex.Random,
    ) {}

    createAstroid(config: AstroidConfig): StaticSpaceObject {
        const typeKey = config.typeKey || this.random.pickOne(Object.keys(AstroidTypes)) as AstroidTypeKey;
        const astroidType = AstroidTypes[typeKey];

        const astroid = new StaticSpaceObject(
            `${astroidType.name} Astroid #${config.index}`,
            astroidType.image,
            astroidType.color,
            ex.Vector.Zero
        );

        this.addComponents(astroid, typeKey, astroidType);
        this.bindEvents(astroid);

        return astroid;
    }

    private addComponents(astroid: StaticSpaceObject, typeKey: AstroidTypeKey, type: typeof AstroidTypes[AstroidTypeKey]) {
        astroid.addComponent(new MinableComponent(
            typeKey as MinableWares,
            this.random.integer(type.minAmount, type.maxAmount),
            type.maxAmount,
            this.random.floating(type.minRespawnRate, type.maxRespawnRate),
        ));
    }

    private bindEvents(astroid: StaticSpaceObject) {
        astroid.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
            this.scene.onSelectAstroid(evt.target as StaticSpaceObject);
        });

        astroid.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
            this.scene.onTargetAstroid(evt.target as StaticSpaceObject);
        });
    }
}
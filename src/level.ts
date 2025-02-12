import * as ex from "excalibur";
import { Player } from "./player";
import { StaticSpaceObject } from "./StaticSpaceObject";
import { Map } from "./map";
import { Background } from "./background";
import { Resources } from "./resources";

export class MyLevel extends ex.Scene {
    random = new ex.Random(42);
    map = new Map(this.random, 48, 1);
    player = new Player(Resources.ShipF, ex.Color.Green, this.map);
    staticObjects: StaticSpaceObject[] = [];

    override onInitialize(engine: ex.Engine): void {
        // this.add(new Background(this.random, Resources.BackdropBlackLittleSparkBlack.toSprite(), 0.1, this.player));
        // this.add(new Background(this.random, Resources.Parallax100.toSprite(), 0.01, this.player));
        // this.add(new Background(this.random, Resources.Parallax80.toSprite(), 0.02, this.player));
        this.add(new Background(this.random, Resources.Parallax60.toSprite(), 0.05, this.player));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.1, this.player));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.2, this.player));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.5, this.player));

        // return;
        this.add(this.map);

        this.player.pos = ex.vec(engine.drawWidth / 2, engine.drawHeight / 2);
        this.add(this.player);

        for (let i = 0; i < 5; i++) {
            const stationImage = this.random.pickOne([Resources.StationA, Resources.StationB]);
            const stationColor = this.random.pickOne([ex.Color.ExcaliburBlue, ex.Color.Vermilion]);
            const pos = this.getRandomPosWithMinDistance();
            if (pos.equals(ex.Vector.Zero)) {
                console.log('Failed to get a valid position for station', i);
                break;
            }
            const station = new StaticSpaceObject(`Station ${i}`, stationImage, stationColor, pos);
            this.add(station);
            this.staticObjects.push(station);
        }

        for (let i = 0; i < 25; i++) {
            const astroidImage = this.random.pickOne([Resources.AstroidA, Resources.AstroidB, Resources.AstroidC, Resources.AstroidD, Resources.AstroidE, Resources.AstroidF, Resources.AstroidG, Resources.AstroidH]);
            const astroidColor = this.random.pickOne([ex.Color.Brown, ex.Color.Gray]);
            const pos = this.getRandomPosWithMinDistance();
            if (pos.equals(ex.Vector.Zero)) {
                console.log('Failed to get a valid position for astroid', i);
                break;
            }
            const astroid = new StaticSpaceObject(`Astroid ${i}`, astroidImage, astroidColor, pos);
            this.add(astroid);  
            this.staticObjects.push(astroid);
        }

        engine.input.pointers.primary.on('down', (evt: ex.PointerEvent) => {
            this.player.targetPos = evt.worldPos;
            this.map.onClick(evt.worldPos);
        });
    }

    private getRandomPosWithMinDistance(minDistance: number = 64, maxAttempts: number = 25): ex.Vector {
        const pos = ex.vec(0, 0)
        for (let i = 0; i < maxAttempts; i++) {
            pos.setTo(this.random.integer(64, this.engine.drawWidth - 64), this.random.integer(64, this.engine.drawHeight - 64));
            if (!this.staticObjects.some(obj => obj.pos.distance(pos) < minDistance)) {
                return pos;
            }
        }
        return ex.Vector.Zero;
    }
}
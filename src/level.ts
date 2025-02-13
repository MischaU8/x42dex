import * as ex from "excalibur";
import { Config } from "./config";
import { Player } from "./player";
import { Ship, ShipEvents, ShipStatusEvent } from "./ship";
import { StaticSpaceObject } from "./StaticSpaceObject";
import { Map } from "./map";
import { Background } from "./background";
import { Resources } from "./resources";

export class MyLevel extends ex.Scene {
    random = new ex.Random(Config.Seed);
    map = new Map(this.random, Config.MapCols, Config.MapRows, Config.MapSize, Config.MapPadding);
    player = new Player('Player', Resources.ShipF, ex.Color.Green, this.map);
    staticObjects: StaticSpaceObject[] = [];
    selectedPlayer: Player | null = null;
    statusLabel = new ex.Label({
        text: 'Status: idle',
        x: 0,
        y: 0,
        z: 1,
        coordPlane: ex.CoordPlane.Screen,
        font: new ex.Font({
            size: Config.FontSize,
            color: ex.Color.White
        })
    });

    override onInitialize(engine: ex.Engine): void {
        // this.add(new Background(this.random, Resources.BackdropBlackLittleSparkBlack.toSprite(), 0.1, this.player));
        // this.add(new Background(this.random, Resources.Parallax100.toSprite(), 0.01));
        // this.add(new Background(this.random, Resources.Parallax80.toSprite(), 0.02));
        this.add(new Background(this.random, Resources.Parallax60.toSprite(), 0.05));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.1));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.2));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.5));

        // return;
        this.add(this.map);
        this.add(this.statusLabel);

        this.player.pos = ex.vec(this.map.gridWidth / 2, this.map.gridHeight / 2 - this.map.hexHeight / 2);
        console.log('player pos', this.player.pos);
        this.add(this.player);

        for (let i = 0; i < Config.NumStations; i++) {
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

        for (let i = 0; i < Config.NumAstroids; i++) {
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

        for (let i = 0; i < Config.NumShips; i++) {
            const shipImage = this.random.pickOne([Resources.ShipA, Resources.ShipB, Resources.ShipC, Resources.ShipD, Resources.ShipE]);
            const shipColor = this.random.pickOne([ex.Color.Magenta, ex.Color.Orange, ex.Color.Violet, ex.Color.Red]);
            const pos = this.getRandomPosWithMinDistance();
            if (pos.equals(ex.Vector.Zero)) {
                console.log('Failed to get a valid position for ship', i);
                break;
            }
            const ship = new Ship(`Ship ${i}`, shipImage, shipColor, this.map);
            // ship.graphics.isVisible = false;
            ship.pos = pos;
            ship.cargo = 1; // cheat so we start mining
            this.add(ship);

            this.shipAutoMine(ship);

            ship.events.on(ShipEvents.Stopped, () => {
                this.shipAutoMine(ship);
            });
        }

        engine.currentScene.camera.pos = this.player.pos;

        engine.input.pointers.primary.on('down', (evt: ex.PointerEvent) => {
            if (!this.map.isPointInMap(evt.worldPos)) {
                return;
            }
            if (evt.button === ex.PointerButton.Left) {
                this.map.onClick(evt.worldPos);
            } else if (evt.button === ex.PointerButton.Right) {
                this.player.orderMoveTo(evt.worldPos);
            }
        });

        this.player.events.on(ShipEvents.Status, (evt: ShipStatusEvent) => {
            this.updateStatusLabel(evt.status);
        });
    }

    private shipAutoMine(ship: Ship) {
        let targetName = ''
        if (ship.cargo > 0) {
            // console.log('Ship', ship.name, 'stopped at station');
            ship.cargo = 0;
            targetName = 'Astroid';
        } else {
            // console.log('Ship', ship.name, 'stopped at astroid');
            ship.cargo = Config.MaxCargo;
            targetName = 'Station';
        }
        ship.orderMoveTo(this.getRandomStaticObjectWithPrefix(targetName).pos);
    }

    private updateStatusLabel(status: string) {
        this.statusLabel.text = `Status: ${status}`;
    }

    private getRandomStaticObjectWithPrefix(prefix: string): StaticSpaceObject {
        const objects = this.staticObjects.filter(obj => obj.name.startsWith(prefix));
        return this.random.pickOne(objects);
    }

    private getRandomPosWithMinDistance(minDistance: number = 64, maxAttempts: number = 25): ex.Vector {
        const pos = ex.vec(0, 0)
        for (let i = 0; i < maxAttempts; i++) {
            pos.setTo(
                this.random.integer(0, this.map.gridWidth)-this.map.hexWidth/2,
                this.random.integer(0, this.map.gridHeight)-this.map.hexHeight*0.75);
            if (!this.map.isPointInMap(pos)) {
                continue;
            }
            if (!this.staticObjects.some(obj => obj.pos.distance(pos) < minDistance)) {
                return pos;
            }
        }
        return ex.Vector.Zero;
    }
}
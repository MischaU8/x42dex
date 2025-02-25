import * as ex from "excalibur";

import * as gev from "../gameevents";

import { AstroidTypes, AstroidTypeKey } from "../data/astroids";
import { MinableWares } from "../data/wares";
import { Config } from "../config";
import { Resources } from "../resources";

import { ActorDetailsPanel } from "../hud/ActorDetailsPanel";
import { Background } from "../actors/background";

import { Map } from "../actors/map";
import { Player } from "../actors/player";
import { Ship, ShipEvents, ShipStatusEvent } from "../actors/ship";
import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { Cursor } from "../actors/cursor";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";
import { MinableComponent } from "../components/minable";
import { StationComponent } from "../components/station";
import { AutopilotComponent } from "../components/autopilot";
import { CargoComponent } from "../components/cargo";
import { AutominerComponent } from "../components/autominer";
import { WalletComponent } from "../components/wallet";

export class MyLevel extends ex.Scene {
    random = new ex.Random(Config.Seed);
    map = new Map(this.random, Config.MapCols, Config.MapRows, Config.MapSize, Config.MapPadding);
    player = new Player('Player', Resources.ShipF, ex.Color.Green, this.map);
    staticObjects: StaticSpaceObject[] = [];
    cursor!: Cursor;
    pausableMotionSystem = new PausableMotionSystem(this.world, this.physics);

    following = false;
    statusLabel = new ex.Label({
        text: '',
        x: 10,
        y: 10,
        z: 1,
        coordPlane: ex.CoordPlane.Screen,
        font: new ex.Font({
            family: 'monospace',
            size: Config.FontSize,
            color: ex.Color.White
        })
    });
    actorDetails = new ActorDetailsPanel();

    override onInitialize(engine: ex.Engine): void {
        // replace the default motion system with a pausable one
        this.world.remove(this.world.get(ex.MotionSystem));
        this.world.add(this.pausableMotionSystem);

        if (Config.Background) {
            this.setupParallaxBackground();
        }

        this.add(this.map);
        this.add(this.statusLabel);
        // this.actorDetails.pos.setTo(10, engine.screen.drawHeight-172);
        this.add(this.actorDetails);
        this.spawnPlayer(engine);
        this.spawnStations();
        this.spawnAstroids();
        this.spawnShips();

        this.cursor = new Cursor('cursor', this.player);
        this.add(this.cursor);
        this.actorDetails.setTarget(this.player);

        this.registerEvents(engine);
    }

    private spawnPlayer(engine: ex.Engine<any>) {
        this.player.pos = ex.vec(this.map.gridWidth / 2, this.map.gridHeight / 2 - this.map.hexHeight / 2);
        engine.currentScene.camera.pos = this.player.pos;
        this.player.addComponent(new AutopilotComponent());
        this.player.addComponent(new CargoComponent());
        this.player.addComponent(new WalletComponent(1000));
        this.add(this.player);

        this.player.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
            this.onSelectShip(evt.target as Ship);
        });

        this.player.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
            this.onTargetShip(evt.target as Ship);
        });

        this.player.events.on(ShipEvents.Status, (evt: ShipStatusEvent) => {
            this.setStatusLabel(evt.status);
        });
    }

    private setupParallaxBackground() {
        // this.add(new Background(this.random, Resources.BackdropBlackLittleSparkBlack.toSprite(), 0.1, this.player));
        // this.add(new Background(this.random, Resources.Parallax100.toSprite(), 0.01));
        // this.add(new Background(this.random, Resources.Parallax80.toSprite(), 0.02));
        this.add(new Background(this.random, Resources.Parallax60.toSprite(), 0.05));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.1));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.2));
        this.add(new Background(this.random, Resources.BackdropBlackLittleSparkTransparent.toSprite(), 0.5));
    }

    private registerEvents(engine: ex.Engine<any>) {
        engine.input.pointers.primary.on('down', (evt: ex.PointerEvent) => {
            if (!this.map.isPointInMap(evt.worldPos)) {
                return;
            }
            if (evt.button === ex.PointerButton.Left) {
                //this.map.onClick(evt.worldPos);
                // this.deselectAny();
            } else if (evt.button === ex.PointerButton.Right) {
                this.player.orderMoveTo(evt.worldPos);
            }
        });

        engine.input.keyboard.on("press", (evt: ex.KeyEvent) => {
            if (evt.key === ex.Keys.Space) {
                if (this.pausableMotionSystem.paused) {
                    this.setStatusLabel('GAME RESUMED');
                    this.pausableMotionSystem.paused = false;
                } else {
                    this.setStatusLabel('GAME PAUSED', 0);
                    this.pausableMotionSystem.paused = true;
                }
            } else if (evt.key === ex.Keys.Escape) {
                this.deselectAny();
                this.cursor.target = null;
            } else if (evt.key === ex.Keys.F) {
                if (this.following) {
                    this.engine.currentScene.camera.clearAllStrategies();
                    this.setStatusLabel('Unfollowing', 1000);
                    this.following = false;
                } else if (this.cursor.target instanceof Ship) {
                    this.engine.currentScene.camera.strategy.lockToActor(this.cursor.target as Ship);
                    this.setStatusLabel(`Following ${this.cursor.target.name}`, 1000);
                    this.following = true;
                }
            }
        });
    }

    private spawnShips() {
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
            ship.addComponent(new CargoComponent());
            ship.addComponent(new WalletComponent());
            ship.addComponent(new AutopilotComponent());
            ship.addComponent(new AutominerComponent(this,
                this.random.integer(Config.AutoMinerMinMineAmount, Config.AutoMinerMaxMineAmount),
                this.random.integer(Config.AutoMinerMinUnloadAmount, Config.AutoMinerMaxUnloadAmount),
                this.random.floating(Config.AutoMinerMinUnloadThreshold, Config.AutoMinerMaxUnloadThreshold),
                this.random.integer(Config.AutoMinerMinTopNAstroids, Config.AutoMinerMaxTopNAstroids),
                this.random.integer(Config.AutoMinerMinTopNStations, Config.AutoMinerMaxTopNStations)));
            this.add(ship);

            ship.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
                this.onSelectShip(evt.target as Ship);
            });

            ship.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
                this.onTargetShip(evt.target as Ship);
            });
        }
    }

    private spawnAstroids() {
        for (let i = 0; i < Config.NumAstroids; i++) {
            const pos = this.getRandomPosWithMinDistance();
            if (pos.equals(ex.Vector.Zero)) {
                console.warn('Failed to get a valid position for astroid', i);
                break;
            }

            // TODO weight the astroid type by frequency
            const astroidTypeKey = this.random.pickOne(Object.keys(AstroidTypes));
            const astroidType = AstroidTypes[astroidTypeKey as AstroidTypeKey];
            const astroid = new StaticSpaceObject(`${astroidType.name} Astroid #${i}`, astroidType.image, astroidType.color, pos);
            astroid.addComponent(new MinableComponent(
                astroidTypeKey as MinableWares,
                this.random.integer(astroidType.minAmount, astroidType.maxAmount),
                astroidType.maxAmount,
                this.random.floating(astroidType.minRespawnRate, astroidType.maxRespawnRate),
            ));
            this.add(astroid);
            this.staticObjects.push(astroid);

            astroid.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
                this.onSelectAstroid(evt.target as StaticSpaceObject);
            });

            astroid.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
                this.onTargetAstroid(evt.target as StaticSpaceObject);
            });
        }
    }

    private spawnStations() {
        for (let i = 0; i < Config.NumStations; i++) {
            const pos = this.getRandomPosWithMinDistance(64 * Config.WorldSize);
            if (pos.equals(ex.Vector.Zero)) {
                console.log('Failed to get a valid position for station', i);
                break;
            }

            const stationImage = this.random.pickOne([Resources.StationA, Resources.StationB]);
            const stationColor = this.random.pickOne([ex.Color.ExcaliburBlue, ex.Color.Teal]);
            const station = new StaticSpaceObject(`Station ${i}`, stationImage, stationColor, pos);
            station.addComponent(new StationComponent(this.random));
            station.addComponent(new CargoComponent(Config.StationMaxVolume));
            station.addComponent(new WalletComponent(this.random.integer(Config.StationMinInitialBalance, Config.StationMaxInitialBalance)));
            this.add(station);
            this.staticObjects.push(station);

            station.events.on(gev.MyActorEvents.Selected, (evt: gev.ActorSelectedEvent) => {
                this.onSelectStation(evt.target as StaticSpaceObject);
            });

            station.events.on(gev.MyActorEvents.Targeted, (evt: gev.ActorTargetedEvent) => {
                this.onTargetStation(evt.target as StaticSpaceObject);
            });
        }
    }

    private deselectAny() {
        this.map.deselectHexagon();
        this.actorDetails.resetTarget();
    }

    private onSelectAstroid(astroid: StaticSpaceObject) {
        this.deselectAny();
        if (this.cursor.target === astroid) {
            this.cursor.target = null;
            console.log('Deselected astroid', astroid.name);
            this.setStatusLabel(`Deselected ${astroid.name}`);
        } else {
            this.cursor.target = astroid;
            console.log('Selected astroid', astroid.name);
            this.setStatusLabel(`Selected ${astroid.name}`);
            this.actorDetails.setTarget(astroid);
        }
    }

    private onSelectStation(station: StaticSpaceObject) {
        this.deselectAny();
        if (this.cursor.target === station) {
            this.cursor.target = null;
            console.log('Deselected station', station.name);
            this.setStatusLabel(`Deselected ${station.name}`);
        } else {
            this.cursor.target = station;
            console.log('Selected station', station.name);
            this.setStatusLabel(`Selected ${station.name}`);
            this.actorDetails.setTarget(station);
        }
    }

    private onSelectShip(ship: Ship) {
        this.deselectAny();
        if (this.cursor.target === ship) {
            this.cursor.target = null;
            console.log('Deselected ship', ship.name);
            this.setStatusLabel(`Deselected ${ship.name}`);
        } else {
            this.cursor.target = ship;
            console.log('Selected ship', ship.name);
            this.setStatusLabel(`Selected ${ship.name}`);
            this.actorDetails.setTarget(ship);
        }
    }

    private onTargetShip(ship: Ship) {
        console.log('Targeted ship', ship.name);
        this.player.orderFollow(ship);
    }

    private onTargetAstroid(astroid: StaticSpaceObject) {
        console.log('Targeted astroid', astroid.name);
        this.player.orderMoveTo(astroid);
    }

    private onTargetStation(station: StaticSpaceObject) {
        console.log('Targeted station', station.name);
        this.player.orderMoveTo(station);
    }

    private setStatusLabel(status: string, duration: number = 1000) {
        this.statusLabel.text = status;
        if (duration > 0) {
            this.engine.clock.schedule(() => {
                if (this.statusLabel.text === status) {
                    this.statusLabel.text = '';
                }
            }, duration);
        }
    }

    public getNearbyStaticObjectWithComponent(source: ex.Actor, component: ex.ComponentCtor<ex.Component>, topN: number = 1, maxRange: number = 128, exclude: ex.Actor[] = []): StaticSpaceObject {
        const objects = this.staticObjects.filter(obj => obj.has(component) && !exclude.includes(obj) && source.pos.distance(obj.pos) <= maxRange);
        const sortedObjects = objects.sort((a, b) => source.pos.distance(a.pos) - source.pos.distance(b.pos));
        return this.random.pickOne(sortedObjects.slice(0, topN));
    }

    public getRandomStaticObjectWithComponent(component: ex.ComponentCtor<ex.Component>): StaticSpaceObject {
        const objects = this.staticObjects.filter(obj => obj.has(component));
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
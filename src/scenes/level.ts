import * as ex from "excalibur";

import { Config } from "../config";
import { Resources } from "../resources";

import { ActorDetailsPanel } from "../hud/ActorDetailsPanel";
import { StationListPanel } from "../hud/StationListPanel";
import { Background } from "../actors/background";

import { Map } from "../actors/map";
import { Ship } from "../actors/ship";
import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { Cursor } from "../actors/cursor";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";
import { DefaultShipConfigs } from "../data/ships";
import { DefaultStationConfigs } from "../data/stations";
import { ShipFactory } from "../factories/ShipFactory";
import { ManualFlightComponent } from "../components/manualflight";
import { StationFactory } from "../factories/StationFactory";
import { AstroidFactory } from "../factories/AstroidFactory";

export class MyLevel extends ex.Scene {
    random = new ex.Random(Config.Seed);
    map = new Map(this.random, Config.MapCols, Config.MapRows, Config.MapSize, Config.MapPadding);

    player!: Ship;
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
    stationList = new StationListPanel(this, this.staticObjects);
    private shipFactory!: ShipFactory;
    private stationFactory!: StationFactory;
    private astroidFactory!: AstroidFactory;

    override onInitialize(engine: ex.Engine): void {
        this.shipFactory = new ShipFactory(this, this.random, this.map);
        this.stationFactory = new StationFactory(this, this.random);
        this.astroidFactory = new AstroidFactory(this, this.random);
        // replace the default motion system with a pausable one
        this.world.remove(this.world.get(ex.MotionSystem));
        this.world.add(this.pausableMotionSystem);

        if (Config.Background) {
            this.setupParallaxBackground();
        }

        this.add(this.map);
        this.add(this.statusLabel);
        this.add(this.actorDetails);
        this.add(this.stationList);
        this.spawnStations();
        this.spawnAstroids();
        this.spawnShips(engine);

        this.cursor = new Cursor('cursor', this.player);
        this.add(this.cursor);
        this.actorDetails.setTarget(this.player);

        this.registerEvents(engine);
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
                // toggle pause
                if (this.pausableMotionSystem.paused) {
                    this.setStatusLabel('GAME RESUMED');
                    this.pausableMotionSystem.paused = false;
                } else {
                    this.setStatusLabel('GAME PAUSED', 0);
                    this.pausableMotionSystem.paused = true;
                }
            } else if (evt.key === ex.Keys.Escape) {
                // deselect any target
                this.deselectAny();
                this.cursor.target = null;
                this.stationList.isVisible = false;
            } else if (evt.key === ex.Keys.F) {
                // toggle following the selected ship
                if (this.following) {
                    this.engine.currentScene.camera.clearAllStrategies();
                    this.setStatusLabel('Unfollowing', 1000);
                    this.following = false;
                } else if (this.cursor.target instanceof Ship) {
                    this.engine.currentScene.camera.strategy.lockToActor(this.cursor.target as Ship);
                    this.setStatusLabel(`Following ${this.cursor.target.name}`, 1000);
                    this.following = true;
                }
            } else if (evt.key === ex.Keys.C) {
                // select and focus on player ship
                this.engine.currentScene.camera.pos = this.player.pos;
                this.onSelectShip(this.player);
            } else if (evt.key === ex.Keys.Key1) {
                this.stationList.isVisible = !this.stationList.isVisible;
            }
        });
    }

    private spawnShips(engine: ex.Engine<any>) {
        for (const config of DefaultShipConfigs) {
            for (let i = 0; i < config.count; i++) {
                const pos = this.getRandomPosWithMinDistance();
                if (pos.equals(ex.Vector.Zero)) {
                    console.log(`Failed to get a valid position for ${config.name} ship ${i}`);
                    break;
                }

                const ship = this.shipFactory.createShip(config);

                if (config.name === 'Player') {
                    this.setupPlayer(engine, ship);
                } else {
                    ship.pos = pos;
                    ship.rotation = this.random.floating(0, Math.PI * 2);
                }
                this.add(ship);
            }
        }
    }

    private setupPlayer(engine: ex.Engine<any>, ship: Ship) {
        ship.addComponent(new ManualFlightComponent());
        ship.pos = ex.vec(this.map.gridWidth / 2, this.map.gridHeight / 2 - this.map.hexHeight / 2);
        ship.rotation = 0;
        engine.currentScene.camera.pos = ship.pos;
        this.player = ship;
    }

    private spawnAstroids() {
        for (let i = 0; i < Config.NumAstroids; i++) {
            const pos = this.getRandomPosWithMinDistance();
            if (pos.equals(ex.Vector.Zero)) {
                console.warn('Failed to get a valid position for astroid', i);
                break;
            }

            const astroid = this.astroidFactory.createAstroid({
                name: 'Astroid',
                index: i
            });
            astroid.pos = pos;

            this.add(astroid);
            this.staticObjects.push(astroid);
        }
    }

    private spawnStations() {
        // Keep track of stations by type to check distances
        const stationsByType: Record<string, StaticSpaceObject[]> = {};

        for (const config of DefaultStationConfigs) {
            stationsByType[config.name] = [];

            for (let i = 0; i < config.count; i++) {
                const pos = this.getRandomPosWithMinDistanceForType(
                    Config.MinStationDistance,
                    Config.MinStationDistanceSameType,
                    stationsByType[config.name]
                );

                if (pos.equals(ex.Vector.Zero)) {
                    console.log(`Failed to get a valid position for ${config.name} ${i}`);
                    break;
                }

                const station = this.stationFactory.createStation({
                    ...config,
                    index: i
                });
                station.pos = pos;

                this.add(station);
                this.staticObjects.push(station);

                // Add to type-specific tracking
                stationsByType[config.name].push(station);
            }
        }
    }

    deselectAny() {
        this.map.deselectHexagon();
        this.actorDetails.resetTarget();
    }

    onSelectAstroid(astroid: StaticSpaceObject) {
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

    onSelectStation(station: StaticSpaceObject, focus: boolean = false) {
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
            if (focus) {
                this.engine.currentScene.camera.pos = station.pos;
            }
        }
    }

    onSelectShip(ship: Ship) {
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

    onTargetShip(ship: Ship) {
        console.log('Targeted ship', ship.name);
        this.player.orderFollow(ship);
    }

    onTargetAstroid(astroid: StaticSpaceObject) {
        console.log('Targeted astroid', astroid.name);
        this.player.orderMoveTo(astroid);
    }

    onTargetStation(station: StaticSpaceObject) {
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

    private getRandomPosWithMinDistanceForType(
        minDistance: number = 64,
        minSameTypeDistance: number = 64,
        sameTypeStations: StaticSpaceObject[],
        maxAttempts: number = 25
    ): ex.Vector {
        const pos = ex.vec(0, 0);

        for (let i = 0; i < maxAttempts; i++) {
            pos.setTo(
                this.random.integer(0, this.map.gridWidth)-this.map.hexWidth/2,
                this.random.integer(0, this.map.gridHeight)-this.map.hexHeight*0.75
            );

            if (!this.map.isPointInMap(pos)) {
                continue;
            }

            // Check distance from all other objects
            if (this.staticObjects.some(obj => obj.pos.distance(pos) < minDistance)) {
                continue;
            }

            // Additional check for same-type stations with larger minimum distance
            if (sameTypeStations.some(station => station.pos.distance(pos) < minSameTypeDistance)) {
                continue;
            }

            return pos;
        }
        return ex.Vector.Zero;
    }
}
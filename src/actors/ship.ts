import * as ex from "excalibur";
import { ColorizeGLSL } from "../materials";
import { Config } from "../config";
import { Map } from "./map";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";
import * as gev from "../gameevents";
import { AutopilotComponent, ShipTarget } from "../components/autopilot";
import { CargoComponent } from "../components/cargo";
import { AutominerComponent } from "../components/autominer";
import { WalletComponent } from "../components/wallet";
import { MovementComponent } from "../components/movement";

export type ShipEvents = {
  status: ShipStatusEvent;
  stopped: ShipStoppedEvent;
}

export class ShipStatusEvent extends ex.GameEvent<Ship> {
  constructor(public target: Ship, public status: string) {
    super();
  }
}
export class ShipStoppedEvent extends ex.GameEvent<Ship> {
  constructor(public target: Ship, public where: ShipTarget) {
    super();
  }
}

export const ShipEvents = {
  Status: 'status',
  Stopped: 'stopped'
} as const;


export class Ship extends ex.Actor {
  public events = new ex.EventEmitter<ex.ActorEvents & gev.MyActorEvents & ShipEvents>();

  map: Map;
  image: ex.ImageSource;
  tileQR: [number | null, number | null] = [null, null];

  sensorRadius: number = 128;
  scanRadius: number = 4 * 128;

  motionSystem!: PausableMotionSystem;
  movement!: MovementComponent;
  constructor(name: string, image: ex.ImageSource, color: ex.Color, map: Map) {
    super({
      name,
      pos: ex.vec(0, 0),
      width: 16,
      height: 16,
      color,
      z: 10,
    });
    this.image = image;
    this.map = map;
  }

  override onInitialize(engine: ex.Engine) {
    this.motionSystem = engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
    this.movement = this.get(MovementComponent) as MovementComponent;
    this.graphics.add(this.image.toSprite({
      destSize: {
        width: this.width,
        height: this.height,
      },
    }));

    const material = engine.graphicsContext.createMaterial({
      name: 'colorize',
      color: this.color,
      fragmentSource: ColorizeGLSL,
    });
    this.graphics.material = material;

    this.on('pointerdown', evt => {
      evt.cancel();
      if (evt instanceof ex.PointerEvent) {
        if (evt.button === ex.PointerButton.Left) {
          console.log(`You selected the ship ${this.name} @${evt.worldPos.toString()}`);
          this.events.emit(gev.MyActorEvents.Selected, new gev.ActorSelectedEvent(this));
        } else if (evt.button === ex.PointerButton.Right) {
          console.log(`You targeted the ship ${this.name} @${evt.worldPos.toString()}`);
          this.events.emit(gev.MyActorEvents.Targeted, new gev.ActorTargetedEvent(this));
        }
      }
    });
  }

  public getDetails() {
    return `--[${this.name}]--
   hex ${this.tileQR[0]},${this.tileQR[1]}
 angle ${(this.rotation * 180 / Math.PI).toFixed(0).padStart(3, "0")}°
   vel ${this.vel.magnitude.toFixed(0).padStart(3, "0")}m/s
   acc ${this.acc.magnitude.toFixed(0).padStart(3, "0")}m/s²

wallet ${this.get(WalletComponent)?.getDetails() || '-'}
 cargo ${this.get(CargoComponent)?.getDetails() || '-'}

autominer ${this.get(AutominerComponent)?.getDetails() || 'off'}
autopilot ${this.get(AutopilotComponent)?.enabled ? 'on' : 'off'}
   target ${this.get(AutopilotComponent)?.getTargetDetails()}`;
  }

  public highlight() {
    this.graphics.material!.color = ex.Color.Yellow;
  }

  public unhighlight() {
    this.graphics.material!.color = this.color;
  }

  public onPreUpdate(engine: ex.Engine, delta: number) {
    this.graphics.isVisible = engine.currentScene.camera.zoom >= Config.MinShipVisibilityZoom;

    if (this.motionSystem.paused) {
      return;
    }

    this._spaceDrag();
  }

  public update(engine: ex.Engine, delta: number) {
    if (this.motionSystem.paused) {
      return;
    }

    super.update(engine, delta);

    if (!this.oldPos.equals(this.pos)) {
      const qr = this.map.getTileQR(this.pos);
      if (this.tileQR[0] !== qr[0] || this.tileQR[1] !== qr[1]) {
        this.tileQR = qr;
        this.map.visitTile(this, qr);
      }
    }
  }

  public onPostUpdate(engine: ex.Engine, delta: number) {
    if (this.motionSystem.paused) {
      return;
    }

    this._clamp();
    // this._wrap(engine);
    this._bounce(engine)
  }

  public orderMoveTo(pos: ex.Vector | ex.Actor) {
    this.get(AutopilotComponent)?.setTarget(pos);
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, `move to ${this.get(AutopilotComponent)?.getTargetDetails()}`));
  }

  public orderFollow(ship: Ship) {
    this.get(AutopilotComponent)?.setTarget(ship);
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, `follow ${ship.name}`));
  }

  private _clamp() {
    this.acc = this.acc.clampMagnitude(this.movement.maxAcceleration);
    this.vel = this.vel.clampMagnitude(this.movement.maxVelocity);
    this.angularVelocity = ex.clamp(this.angularVelocity, -this.movement.maxAngularVelocity, this.movement.maxAngularVelocity);
  }

  private _bounce(engine: ex.Engine) {
    if (this.acc.x === 0 && this.acc.y === 0) {
      return;
    }
    const bounceStrength = 2;
    if (this.pos.x < -this.map.hexWidth / 2) {
      this.acc.x += Math.abs(this.pos.x - (-this.map.hexWidth / 2)) * bounceStrength;
    }
    if (this.pos.x > this.map.gridWidth - this.map.hexWidth / 2) {
      this.acc.x -= Math.abs(this.pos.x - (this.map.gridWidth - this.map.hexWidth / 2)) * bounceStrength;
    }
    if (this.pos.y < -this.map.hexHeight * 0.75) {
      this.acc.y += Math.abs(this.pos.y - (-this.map.hexHeight * 0.75)) * bounceStrength;
    }
    if (this.pos.y > this.map.gridHeight - this.map.hexHeight * 0.75) {
      this.acc.y -= Math.abs(this.pos.y - (this.map.gridHeight - this.map.hexHeight * 0.75)) * bounceStrength;
    }
  }

  private _spaceDrag() {
    if (Math.abs(this.angularVelocity) > 0.01) {
      this.angularVelocity *= Config.AngularVelocityDecay;
    } else {
      this.angularVelocity = 0;
    }

    if (this.acc.magnitude > 0.01) {
      this.acc = this.acc.scale(Config.AccelerationDecay);
    } else {
      this.acc.setTo(0, 0);
    }

    if (this.vel.magnitude > 0.01) {
      this.vel = this.vel.scale(Config.VelocityDecay);
    } else {
      this.vel.setTo(0, 0);
    }
  }

  public rotateLeft() {
    this.angularVelocity -= this.movement.maxAngularVelocity;
  }

  public rotateRight() {
    this.angularVelocity += this.movement.maxAngularVelocity;
  }

  public moveForward(level: number = 1) {
    // boost forward in the direction the player is facing
    this.acc = this.acc.add(ex.Vector.fromAngle(this.rotation - Math.PI / 2).scale(this.movement.maxAcceleration * level));
  }

  public moveBackward(level: number = 1) {
    // const angle = this.vel.angleBetween(this.rotation - Math.PI / 2, RotationType.ShortestPath)
    if (this.vel.magnitude > 0) {
      // break in the direction we are moving
      this.acc = this.acc.add(this.vel.normalize().scale(-this.movement.maxDeceleration * level));
    } else {
      // TODO boost backwards
      // this.acc = this.acc.add(Vector.fromAngle(this.rotation + Math.PI / 2).scale(25));
    }
  }

  public orderStop(manual: boolean = false, target: ShipTarget = ex.Vector.Zero) {
    this.vel.setTo(0, 0);
    this.acc.setTo(0, 0);
    this.angularVelocity = 0;

    this.get(AutopilotComponent)?.disable();
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, manual ? 'stopped (manual)' : 'stopped (autopilot)'));
    this.events.emit(ShipEvents.Stopped, new ShipStoppedEvent(this, target));
  }
}

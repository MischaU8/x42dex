import * as ex from "excalibur";
import { ColorizeGLSL } from "../materials";
import { Config } from "../config";
import { Map } from "./map";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";
import * as gev from "../gameevents";

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
  constructor(public target: Ship) {
    super();
  }
}

export const ShipEvents = {
  Status: 'status',
  Stopped: 'stopped'
} as const;

export type ShipTarget = ex.Vector | ex.Actor;

export class Ship extends ex.Actor {
  public events = new ex.EventEmitter<ex.ActorEvents & gev.MyActorEvents & ShipEvents>();

  map: Map;
  image: ex.ImageSource;

  autopilotEnabled: boolean = false;
  target: ShipTarget = ex.vec(0, 0);
  cargo: number = 0;

  tileQR: [number|null, number|null] = [null, null];

  private motionSystem!: PausableMotionSystem;

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

    this.graphics.add(this.image.toSprite({destSize: {
      width: this.width,
      height: this.height,
    },}));

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

  public getTargetPos(): ex.Vector {
    if (this.target instanceof ex.Vector) {
      return this.target;
    } else {
      return this.target.pos;
    }
  }

  public getTargetDetails(): string {
    if (this.target === ex.Vector.Zero) {
      return '---';
    } else if (this.target instanceof ex.Vector) {
      return `[${this.target.x.toFixed(0)},${this.target.y.toFixed(0)}]`;
    } else {
      return `[${this.target.name}]`;
    }
  }

  public getDetails() {
    return `[${this.name}]
   hex ${this.tileQR[0]},${this.tileQR[1]}
 angle ${(this.rotation * 180 / Math.PI).toFixed(0).padStart(3, "0")}°
   vel ${this.vel.magnitude.toFixed(0).padStart(3, "0")}m/s
   acc ${this.acc.magnitude.toFixed(0).padStart(3, "0")}m/s²
 cargo ${this.cargo.toFixed(0).padStart(3, "0")}
  auto ${this.autopilotEnabled?'on':'off'}
target ${this.getTargetDetails()}`;
  }

  public select() {
    this.graphics.material!.color = ex.Color.Yellow;
  }

  public deselect() {
    this.graphics.material!.color = this.color;
  }

  public onPreUpdate(engine: ex.Engine, delta: number) {
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

    if (this.autopilotEnabled) {
      this._autoPilot();
    }
  }

  public onPostUpdate(engine: ex.Engine, delta: number) {
    if (this.motionSystem.paused) {
      return;
    }

    this._clamp();
    this._wrap(engine);
  }

  public orderMoveTo(pos: ex.Vector | ex.Actor) {
    this.autopilotEnabled = true;
    this.target = pos;
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, `move to ${this.getTargetDetails()}`));
  }

  public orderFollow(ship: Ship) {
    this.autopilotEnabled = true;
    this.target = ship;
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, `follow ${ship.name}`));
  }

  private _autoPilot() {
    if (!this.getTargetPos().equals(ex.Vector.Zero)) {
      const delta = this.getTargetPos().sub(this.pos);
      const distanceToTarget = delta.magnitude;
      const currentSpeed = this.vel.magnitude;

      const leadTime = currentSpeed > 0 ?
        (distanceToTarget / currentSpeed) * Config.PlayerLeadTime :
        Config.PlayerMinLeadTime;

      const leadPos = this.pos.add(this.vel.scale(leadTime));
      const leadDelta = this.getTargetPos().sub(leadPos);

      // Calculate desired angle change
      const targetAngle = leadDelta.angleBetween(this.rotation + Math.PI / 2, ex.RotationType.ShortestPath);
      // Gradually adjust angular velocity towards target
      if (Math.abs(targetAngle) > 0.001) {
        const direction = Math.sign(targetAngle);
        if (direction > 0) {
          this.rotateRight();
        } else {
          this.rotateLeft();
        }
      }

      // Calculate how aligned we are with the target (-1 to 1, where 1 is perfectly aligned)
      const alignment = Math.cos(leadDelta.angleBetween(this.rotation - Math.PI / 2, ex.RotationType.ShortestPath));

      const breakingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxDeceleration);
      const coastingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxAcceleration);

      var maxVelocity = this.calcMaxVelocity(distanceToTarget, alignment);

      if (distanceToTarget < Config.AutoPilotStoppingDistance && !(this.target instanceof Ship)) {
        // console.log('stopping')
        this.orderStop();
      } else if (distanceToTarget < breakingDistance || currentSpeed > maxVelocity) {
        // console.log('breaking')
        this.moveBackward()
      } else if (distanceToTarget > coastingDistance && currentSpeed < maxVelocity) {
        // console.log('accelerating')
        this.moveForward();
      } else {
        // console.log('coasting')
      }
    }
  }

  private calcBreakingDistance(vel: number, acc: number) {
    return (vel * vel) / (2 * acc);
  }

  private calcMaxVelocity(distanceToTarget: number, alignment: number) {
    if (distanceToTarget < Config.AutoPilotStoppingDistance) {
      return 0;
    } else if (alignment < 0) {
      return Config.PlayerMaxVelocity * Config.AutoPilotAlignmentVelocityFactor;
    } else {
      return Config.PlayerMaxVelocity * alignment;
    }
  }

  private _clamp() {
    this.acc = this.acc.clampMagnitude(Config.PlayerMaxAcceleration);
    this.vel = this.vel.clampMagnitude(Config.PlayerMaxVelocity);
    this.angularVelocity = ex.clamp(this.angularVelocity, -Config.PlayerMaxAngularVelocity, Config.PlayerMaxAngularVelocity);
  }

  private _wrap(engine: ex.Engine) {
    if (this.pos.x < -this.map.hexWidth/2) {
      this.pos.x += this.map.gridWidth;
    }
    if (this.pos.x > this.map.gridWidth - this.map.hexWidth/2) {
      this.pos.x -= this.map.gridWidth;
    }
    if (this.pos.y < -this.map.hexHeight*0.75) {
      this.pos.y += this.map.gridHeight;
    }
    if (this.pos.y > this.map.gridHeight - this.map.hexHeight*0.75) {
      this.pos.y -= this.map.gridHeight;
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
    this.angularVelocity -= Config.PlayerMaxAngularVelocity;
  }

  public rotateRight() {
    this.angularVelocity += Config.PlayerMaxAngularVelocity;
  }

  public moveForward(level: number = 1) {
    // boost forward in the direction the player is facing
    this.acc = this.acc.add(ex.Vector.fromAngle(this.rotation - Math.PI / 2).scale(Config.PlayerMaxAcceleration * level));
  }

  public moveBackward(level: number = 1) {
    // const angle = this.vel.angleBetween(this.rotation - Math.PI / 2, RotationType.ShortestPath)
    if (this.vel.magnitude > 0) {
      // break in the direction we are moving
      this.acc = this.acc.add(this.vel.normalize().scale(-Config.PlayerMaxDeceleration * level));
    } else {
      // TODO boost backwards
      // this.acc = this.acc.add(Vector.fromAngle(this.rotation + Math.PI / 2).scale(25));
    }
  }

  public orderStop(manual: boolean = false) {
    this.vel.setTo(0, 0);
    this.acc.setTo(0, 0);
    this.angularVelocity = 0;

    this.target = ex.Vector.Zero;
    this.autopilotEnabled = false;
    this.events.emit(ShipEvents.Status, new ShipStatusEvent(this, manual ? 'stopped (manual)' : 'stopped (autopilot)'));
    this.events.emit(ShipEvents.Stopped, new ShipStoppedEvent(this));
  }
}

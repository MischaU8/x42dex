import * as ex from "excalibur";
import { ColorizeGLSL } from "./materials";
import { Config } from "./config";
import { Map } from "./map";


export class Player extends ex.Actor {
  targetPos: ex.Vector = ex.vec(0, 0);
  map: Map;
  image: ex.ImageSource;
  constructor(image: ex.ImageSource, color: ex.Color, map: Map) {
    super({
      name: 'Player',
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

    this.graphics.add(this.image.toSprite({destSize: {
      width: this.width,
      height: this.height,
    },}));

    // Simple material that colors every pixel
    const material = engine.graphicsContext.createMaterial({
      name: 'colorize',
      color: this.color,
      fragmentSource: ColorizeGLSL,
    });
    this.graphics.material = material;

    // Sometimes you want to click on an actor!
    this.on('pointerdown', evt => {
      console.log('You clicked the actor @', evt.worldPos.toString());
    });
  }

  public update(engine: ex.Engine, delta: number) {
    this._spaceDrag();

    super.update(engine, delta);

    if (!this.oldPos.equals(this.pos)) {
      this.map.visitTile(this.pos);
    }

    this._keyboardInput(engine);
    this._autoPilot();
    
    this._clamp();
    this._wrap(engine);
  }

  private _autoPilot() {
    if (!this.targetPos.equals(ex.Vector.Zero)) {

      const delta = this.targetPos.sub(this.pos);
      const distanceToTarget = delta.magnitude;
      const currentSpeed = this.vel.magnitude;

      const leadTime = currentSpeed > 0 ? 
        (distanceToTarget / currentSpeed) * Config.PlayerLeadTime :
        Config.PlayerMinLeadTime;

      const leadPos = this.pos.add(this.vel.scale(leadTime));
      const leadDelta = this.targetPos.sub(leadPos);

      // Calculate desired angle change
      const targetAngle = leadDelta.angleBetween(this.rotation + Math.PI / 2, ex.RotationType.ShortestPath);
      // Gradually adjust angular velocity towards target
      if (Math.abs(targetAngle) > 0.001) {
        const direction = Math.sign(targetAngle);
        this.angularVelocity += direction * Config.PlayerMaxAngularVelocity;
      }

      // Calculate how aligned we are with the target (-1 to 1, where 1 is perfectly aligned)
      const alignment = Math.cos(leadDelta.angleBetween(this.rotation - Math.PI / 2, ex.RotationType.ShortestPath));
      
      const breakingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxDeceleration);
      const coastingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxAcceleration);

      var maxVelocity = this.calcMaxVelocity(distanceToTarget, alignment);

      if (distanceToTarget < 8) {
        // console.log('stopping')
        this.targetPos.setTo(0, 0);
        this._stop();
      } else if (distanceToTarget < breakingDistance || currentSpeed > maxVelocity) {
        // console.log('breaking')
        this._moveBackward()
      } else if (distanceToTarget > coastingDistance && currentSpeed < maxVelocity) {
        // console.log('accelerating')
        this._moveForward();
      } else {
        // console.log('coasting')
      }
    }
  }

  private calcBreakingDistance(vel: number, acc: number) {
    return (vel * vel) / (2 * acc);
  }

  private calcMaxVelocity(distanceToTarget: number, alignment: number) {
    if (distanceToTarget < 8) {
      return 0;
    } else if (alignment < 0) {
      return Config.PlayerMaxVelocity * 0.05;
    } else {
      return Config.PlayerMaxVelocity * alignment;
    }
  }

  private _keyboardInput(engine: ex.Engine) {
    if (
      engine.input.keyboard.isHeld(ex.Keys.W) ||
      engine.input.keyboard.isHeld(ex.Keys.Up)
    ) {
      this._moveForward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.A) ||
      engine.input.keyboard.isHeld(ex.Keys.Left)) {
      this._rotateLeft();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.S) ||
      engine.input.keyboard.isHeld(ex.Keys.Down)) {
      this._moveBackward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.D) ||
      engine.input.keyboard.isHeld(ex.Keys.Right)) { 
      this._rotateRight();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.Space)) {
      this._stop();
    }
  }

  private _clamp() {
    this.acc = this.acc.clampMagnitude(Config.PlayerMaxAcceleration);
    this.vel = this.vel.clampMagnitude(Config.PlayerMaxVelocity);
    this.angularVelocity = ex.clamp(this.angularVelocity, -Config.PlayerMaxAngularVelocity, Config.PlayerMaxAngularVelocity);
  }

  private _wrap(engine: ex.Engine) {
    if (this.pos.x < 0) {
      this.pos.x = engine.drawWidth;
    }
    if (this.pos.x > engine.drawWidth) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = engine.drawHeight;
    }
    if (this.pos.y > engine.drawHeight) {
      this.pos.y = 0;
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

  private _rotateLeft() {
    this.angularVelocity -= Config.PlayerMaxAngularVelocity;
  }

  private _rotateRight() {
    this.angularVelocity += Config.PlayerMaxAngularVelocity;
  }

  private _moveForward(level: number = 1) {
    // boost forward in the direction the player is facing
    this.acc = this.acc.add(ex.Vector.fromAngle(this.rotation - Math.PI / 2).scale(Config.PlayerMaxAcceleration * level));
  }

  private _moveBackward(level: number = 1) {
    // const angle = this.vel.angleBetween(this.rotation - Math.PI / 2, RotationType.ShortestPath)
    if (this.vel.magnitude > 0) {
      // break in the direction we are moving
      this.acc = this.acc.add(this.vel.normalize().scale(-Config.PlayerMaxDeceleration * level));
    } else {
      // TODO boost backwards
      // this.acc = this.acc.add(Vector.fromAngle(this.rotation + Math.PI / 2).scale(25));
    }
  }

  private _stop() {
    this.vel.setTo(0, 0);
    this.acc.setTo(0, 0);
    this.angularVelocity = 0;
    this.targetPos.setTo(0, 0);
  }
}

import * as ex from "excalibur";
import { ColorizeGLSL } from "../materials";
import { Config } from "../config";
import * as gev from "../gameevents";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";


export class StaticSpaceObject extends ex.Actor {
  public events = new ex.EventEmitter<ex.ActorEvents & gev.MyActorEvents>();

  image: ex.ImageSource;
  motionSystem!: PausableMotionSystem;
  constructor(name: string, image: ex.ImageSource, color: ex.Color, pos: ex.Vector, width: number, height: number) {
    super({
      name,
      pos,
      width,
      height,
      color,
      z: 5,
    });
    this.image = image;
  }

  override onInitialize(engine: ex.Engine) {
    this.motionSystem = engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;

    this.graphics.add(this.image.toSprite({destSize: {
      width: this.width,
      height: this.height,
    }}));

    const material = engine.graphicsContext.createMaterial({
      name: 'colorize',
      color: this.color,
      fragmentSource: ColorizeGLSL,
    });
    this.graphics.material = material;

    this.on('pointerdown', evt => {
      evt.cancel();
      if (evt instanceof ex.PointerEvent && evt.button === ex.PointerButton.Left) {
        console.log(`You selected the object ${this.name} @${evt.worldPos.toString()}`);
        this.events.emit(gev.MyActorEvents.Selected, new gev.ActorSelectedEvent(this));
      } else if (evt instanceof ex.PointerEvent && evt.button === ex.PointerButton.Right) {
        console.log(`You targeted the object ${this.name} @${evt.worldPos.toString()}`);
        this.events.emit(gev.MyActorEvents.Targeted, new gev.ActorTargetedEvent(this));
      }
    });
  }

  public highlight() {
    this.graphics.material!.color = ex.Color.Yellow;
  }

  public unhighlight() {
    this.graphics.material!.color = this.color;
  }
}

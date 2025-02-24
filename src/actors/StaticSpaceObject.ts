import * as ex from "excalibur";
import { ColorizeGLSL } from "../materials";
import { Config } from "../config";
import * as gev from "../gameevents";


export class StaticSpaceObject extends ex.Actor {
  public events = new ex.EventEmitter<ex.ActorEvents & gev.MyActorEvents>();

  image: ex.ImageSource;

  constructor(name: string, image: ex.ImageSource, color: ex.Color, pos: ex.Vector) {
    super({
      name,
      pos,
      width: Config.StaticSpaceObjectWidth,
      height: Config.StaticSpaceObjectHeight,
      color,
      z: 5,
    });
    this.image = image;
  }

  override onInitialize(engine: ex.Engine) {
    this.graphics.add(this.image.toSprite({destSize: {
      width: Config.StaticSpaceObjectWidth,
      height: Config.StaticSpaceObjectHeight,
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

  public select() {
    this.graphics.material!.color = ex.Color.Yellow;
  }

  public deselect() {
    this.graphics.material!.color = this.color;
  }
}

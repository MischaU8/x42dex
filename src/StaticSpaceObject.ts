import * as ex from "excalibur";
import { ColorizeGLSL } from "./materials";
import { Config } from "./config";

type StaticSpaceObjectEvents = {
  selected: StaticSpaceObjectSelectedEvent;
}

export class StaticSpaceObjectSelectedEvent extends ex.GameEvent<StaticSpaceObject> {
  constructor(public target: StaticSpaceObject) {
    super();
  }
}

export const StaticSpaceObjectEvents = {
  Selected: 'selected',
} as const;

export class StaticSpaceObject extends ex.Actor {
  public events = new ex.EventEmitter<ex.ActorEvents & StaticSpaceObjectEvents>();

  image: ex.ImageSource;

  constructor(name: string, image: ex.ImageSource, color: ex.Color, pos: ex.Vector) {
    super({
      name,
      pos,
      width: Config.StaticSpaceObjectWidth,
      height: Config.StaticSpaceObjectHeight,
      color,
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
      console.log(`You clicked the object ${this.name} @${evt.worldPos.toString()}`);
      this.events.emit(StaticSpaceObjectEvents.Selected, new StaticSpaceObjectSelectedEvent(this));
    });
  }
}

import * as ex from "excalibur";
import { ColorizeGLSL } from "./materials";
export class StaticSpaceObject extends ex.Actor {
  image: ex.ImageSource;

  constructor(name: string, image: ex.ImageSource, color: ex.Color, pos: ex.Vector) {
    super({
      name,
      pos,
      width: 32,
      height: 32,
      color,
    });
    this.image = image;
  }

  override onInitialize(engine: ex.Engine) {
    this.graphics.add(this.image.toSprite({destSize: {
      width: 32,
      height: 32,
    }}));

    const material = engine.graphicsContext.createMaterial({
      name: 'colorize',
      color: this.color,
      fragmentSource: ColorizeGLSL,
    });
    this.graphics.material = material;
  }
}

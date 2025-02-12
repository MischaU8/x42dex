import * as ex from "excalibur";
import { Map } from "./map";
import { Ship } from "./ship";

export class Player extends Ship {

  constructor(name: string, image: ex.ImageSource, color: ex.Color, map: Map) {
    super(name, image, color, map);
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);

    this._keyboardInput(engine);
  }

  private _keyboardInput(engine: ex.Engine) {
    if (
      engine.input.keyboard.isHeld(ex.Keys.W) ||
      engine.input.keyboard.isHeld(ex.Keys.Up)
    ) {
      this.moveForward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.A) ||
      engine.input.keyboard.isHeld(ex.Keys.Left)) {
      this.rotateLeft();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.S) ||
      engine.input.keyboard.isHeld(ex.Keys.Down)) {
      this.moveBackward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.D) ||
      engine.input.keyboard.isHeld(ex.Keys.Right)) { 
      this.rotateRight();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.Space)) {
      this.orderStop(true);
    }
  }
}

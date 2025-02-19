import * as ex from "excalibur";

export class PausableMotionSystem extends ex.MotionSystem {
  paused = false;

  public update(elapsed: number) {
    if (this.paused) {
      return;
    }
    super.update(elapsed);
  }
}
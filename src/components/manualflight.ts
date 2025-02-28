import * as ex from 'excalibur'
import { PausableMotionSystem } from '../systems/PausableMotionSystem'
import { Ship } from '../actors/ship';

export class ManualFlightComponent extends ex.Component {
  declare owner: Ship

  motionSystem!: PausableMotionSystem;

  onAdd(owner: ex.Actor): void {
    owner.on('initialize', (evt: ex.InitializeEvent) => {
      this.motionSystem = evt.engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
    })
    owner.on('postupdate', (evt: ex.PostUpdateEvent) => {
      this.onPostUpdate(evt.engine, evt.elapsed)
    })
  }

  onPostUpdate(engine: ex.Engine, _elapsed: number): void {
    if (this.motionSystem.paused) {
      return;
    }
    this.keyboardInput(engine);
  }

  private keyboardInput(engine: ex.Engine) {
    if (
      engine.input.keyboard.isHeld(ex.Keys.W) ||
      engine.input.keyboard.isHeld(ex.Keys.Up)
    ) {
      this.owner.moveForward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.A) ||
      engine.input.keyboard.isHeld(ex.Keys.Left)) {
      this.owner.rotateLeft();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.S) ||
      engine.input.keyboard.isHeld(ex.Keys.Down)) {
      this.owner.moveBackward();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.D) ||
      engine.input.keyboard.isHeld(ex.Keys.Right)) {
      this.owner.rotateRight();
    }

    if (engine.input.keyboard.isHeld(ex.Keys.X)) {
      this.owner.orderStop(true);
    }
  }
}

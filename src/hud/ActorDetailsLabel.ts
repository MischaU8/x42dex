import * as ex from "excalibur";
import { Config } from "../config";
import { Ship } from "../actors/ship";
export class ActorDetailsLabel extends ex.Label {

    target?: ex.Actor;

    constructor() {
        super({
            text: '',
            z: 1,
            coordPlane: ex.CoordPlane.Screen,
            font: new ex.Font({
                family: 'monospace',
                size: Config.FontSize,
                color: ex.Color.White
            })
        });
    }

    onInitialize(engine: ex.Engine) {
        const timer = new ex.Timer({
            fcn: () => this.updateText(),
            repeats: true,
            interval: 200,
          })
        engine.currentScene.add(timer)
        timer.start()
    }

    setTarget(target: ex.Actor) {
        this.target = target;
        this.updateText();
    }

    resetTarget() {
        this.target = undefined;
        this.updateText();
    }

    updateText() {
        if (this.target) {
            if (this.target instanceof Ship) {
                this.text = this.target.getDetails();
            } else {
                this.text = `[${this.target.name}]`;
            };
        } else {
            this.text = '';
        }
        // this.pos.setTo(10, this.scene!.engine.screen.drawHeight - (this.graphics.current?.localBounds.height ?? 172) - 10);
    }
}
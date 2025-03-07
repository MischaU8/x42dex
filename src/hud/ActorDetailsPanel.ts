import * as ex from "excalibur";
import { Ship } from "../actors/ship";
import { MinableComponent } from "../components/minable";
import { StationComponent } from "../components/station";
const ui = document.getElementById('ui')

export class ActorDetailsPanel extends ex.Label {

    target?: ex.Actor;
    divInfo?: HTMLDivElement;

    onInitialize(engine: ex.Engine) {
        const timer = new ex.Timer({
            fcn: () => this.updateText(),
            repeats: true,
            interval: 200,
          })
        engine.currentScene.add(timer)
        timer.start()
    }

    onAdd() {
        this.divInfo = document.createElement('div')
        this.divInfo.className = 'ActorDetailsPanel'
        this.divInfo.innerHTML = '[Info]'
        ui?.appendChild(this.divInfo)
    }

    onRemove() {
        // Ensure we cleanup the DOM and remove any children when transitioning scenes
        this.divInfo?.remove()
        // ui!.innerHTML = ''
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
        if (!this.divInfo) {
            return;
        }
        let text = '';
        if (this.target) {
            if (this.target instanceof Ship) {
                text = this.target.getDetails();
            } else if (this.target.has(MinableComponent)) {
                text = this.target.get(MinableComponent).getDetails();
            } else if (this.target.has(StationComponent)) {
                text = this.target.get(StationComponent).getDetails();
            } else {
                text = `[${this.target.name}]`;
            }
        } else {
            text = ''
        }
        this.divInfo!.innerHTML = text.replaceAll('\n', '<br>')
    }
}
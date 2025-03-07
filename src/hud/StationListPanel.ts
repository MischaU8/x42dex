import * as ex from "excalibur";
import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { StationComponent } from "../components/station";
const ui = document.getElementById('ui')

export class StationListPanel extends ex.Label {

    divInfo?: HTMLDivElement;
    list: StaticSpaceObject[] = [];
    isVisible = true;
    usageTip = '[1] Station List';

    onInitialize(engine: ex.Engine) {
        const timer = new ex.Timer({
            fcn: () => this.updateText(),
            repeats: true,
            interval: 1000,
          })
        engine.currentScene.add(timer)
        timer.start()
    }

    onAdd() {
        this.divInfo = document.createElement('div')
        this.divInfo.className = 'StationListPanel'
        this.divInfo.innerHTML = this.usageTip
        ui?.appendChild(this.divInfo)
    }

    onRemove() {
        // Ensure we cleanup the DOM and remove any children when transitioning scenes
        this.divInfo?.remove()
        // ui!.innerHTML = ''
    }

    setList(list: StaticSpaceObject[]) {
        this.list = list.filter(obj => obj.has(StationComponent));
        this.updateText();
    }

    updateText() {
        if (!this.divInfo) {
            return;
        }
        let text = ''
        if (this.isVisible) {
            text += this.list.map(station => `${station.get(StationComponent).getSummary()}`).join('\n')
        } else {
            text += this.usageTip
        }
        this.divInfo!.innerHTML = text.replaceAll('\n', '<br>')
    }
}
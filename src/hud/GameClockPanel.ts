import * as ex from "excalibur";
import { PausableMotionSystem } from "../systems/PausableMotionSystem";
const ui = document.getElementById('ui')

export class GameClockPanel extends ex.Label {

    divInfo?: HTMLDivElement;
    private _isVisible = true;
    engine!: ex.Engine;

    private gameTime = 0;
    private motionSystem!: PausableMotionSystem;
    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
        this.updateText();
    }

    onInitialize(engine: ex.Engine) {
        this.motionSystem = engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
        this.engine = engine;
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
        this.divInfo.className = 'Panel GameClockPanel'
        this.divInfo.innerHTML = '00:00:00'
        ui?.appendChild(this.divInfo)
    }

    onRemove() {
        // Ensure we cleanup the DOM and remove any children when transitioning scenes
        this.divInfo?.remove()
        // ui!.innerHTML = ''
    }

    updateText() {
        if (!this.divInfo) {
            return;
        }
        if (!this.motionSystem.paused) {
            this.gameTime++;
        }
        let text = '';
        if (this.isVisible) {
            const totalSeconds = Math.floor(this.gameTime);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const timeString = [hours, minutes, seconds]
                .map(n => n.toString().padStart(2, '0'))
                .join(':');

            text = `${timeString}`;
        } else {
            text = '';
        }
        this.divInfo.innerHTML = text;
    }
}
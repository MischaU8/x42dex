import * as ex from "excalibur";
import { StaticSpaceObject } from "../actors/StaticSpaceObject";
import { StationComponent } from "../components/station";
import { MyLevel } from "../scenes/level";
const ui = document.getElementById('ui')

export class StationListPanel extends ex.Label {

    divInfo?: HTMLDivElement;
    list: StaticSpaceObject[] = [];
    private _isVisible = true;
    usageTip = '[1] Station List';
    level: MyLevel;

    constructor(level: MyLevel, stationList: StaticSpaceObject[]) {
        super();
        this.list = stationList;
        this.level = level;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
        this.updateText();
    }

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
        this.divInfo.className = 'Panel StationListPanel'
        this.divInfo.innerHTML = this.usageTip
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
        if (this.isVisible) {
            this.divInfo.innerHTML = '';
            for (const station of this.list.filter(obj => obj.has(StationComponent))) {
                const button = document.createElement('button');
                button.id = `station-${station.id}`;
                button.innerHTML = station.get(StationComponent).getSummary();
                button.addEventListener('click', evt => {
                    console.log(`Selected station ${station.id}`);
                    this.onSelectStation(station);
                });
                this.divInfo.appendChild(button);
                this.divInfo.appendChild(document.createElement('br'));
            }
        } else {
            this.divInfo!.innerHTML = this.usageTip;
        }
    }

    onSelectStation(station: StaticSpaceObject) {
        console.log(`Selected station ${station.id}`);
        this.level.onSelectStation(station, true);
    }
}
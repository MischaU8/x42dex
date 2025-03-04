import * as ex from 'excalibur';
import { WaresType, Wares } from '../data/wares';

export class CargoComponent extends ex.Component {
    declare owner: ex.Actor

    items: Record<WaresType, number> = {} as Record<WaresType, number>;
    volume: number = 0;
    maxVolume: number = 0;
    resourceFilter: WaresType[] = [];
    constructor(maxVolume: number = 0, resourceFilter: WaresType[] = []) {
        super();
        this.maxVolume = maxVolume;
        this.resourceFilter = resourceFilter;
    }

    addItem(item: WaresType, amount: number) {
        this.items[item] = (this.items[item] || 0) + amount;
        this.volume += Wares[item].volume * amount;
        ex.assert(`Cargo volume exceeded max volume: ${this.volume} > ${this.maxVolume}`, () => this.volume <= this.maxVolume);
    }

    removeItem(item: WaresType, amount: number) {
        this.items[item] = (this.items[item] || 0) - amount;
        this.volume -= Wares[item].volume * amount;
        ex.assert(`Cargo item amount exceeded min amount: ${this.items[item]} < 0`, () => this.items[item] >= 0);
        ex.assert(`Cargo volume exceeded min volume: ${this.volume} < 0`, () => this.volume >= 0);
        if (this.items[item] === 0) {
            delete this.items[item];
        }
    }

    getAvailableSpace(): number {
        return this.maxVolume - this.volume;
    }

    getAvailableSpaceFor(item: WaresType): number {
        return Math.floor(this.getAvailableSpace() / Wares[item].volume);
    }

    getDetails(): string {
        let details = `${this.volume.toFixed(0)}/${this.maxVolume.toFixed(0)}m³`;
        if (this.volume > 0) {
            const items = Object.entries(this.items).map(([item, amount]) => `${item.padStart(8, " ")} ${amount.toFixed(0)}x`);
            details += `\n${items.join('\n')}`;
        }
        return details;
    }
}
import * as ex from 'excalibur';
import { WaresType, Wares, WaresKey } from '../data/wares';

export class CargoComponent extends ex.Component {
    declare owner: ex.Actor

    items: Record<WaresType, number> = {} as Record<WaresType, number>;
    volume: number = 0;
    maxVolume: number = 0;

    constructor(maxVolume: number = 1000) {
        super();
        this.maxVolume = maxVolume;
    }

    addItem(item: WaresType, amount: number) {
        this.items[item] = (this.items[item] || 0) + amount;
        this.volume += Wares[item as WaresKey].volume * amount;
        ex.assert(`Cargo volume exceeded max volume: ${this.volume} > ${this.maxVolume}`, () => this.volume <= this.maxVolume);
    }

    removeItem(item: WaresType, amount: number) {
        this.items[item] = (this.items[item] || 0) - amount;
        this.volume -= Wares[item as WaresKey].volume * amount;
        ex.assert(`Cargo item amount exceeded min amount: ${this.items[item]} < 0`, () => this.items[item] >= 0);
        ex.assert(`Cargo volume exceeded min volume: ${this.volume} < 0`, () => this.volume >= 0);
    }

    getAvailableSpace(): number {
        return this.maxVolume - this.volume;
    }

    getAvailableSpaceFor(item: WaresType): number {
        return Math.floor(this.getAvailableSpace() / Wares[item as WaresKey].volume);
    }

    getDetails(): string {
        return `volume: ${this.volume}/${this.maxVolume}\n${Object.entries(this.items).map(([item, amount]) => `${item}: ${amount}`).join('\n')}`;
    }
}
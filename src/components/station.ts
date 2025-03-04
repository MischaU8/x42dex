import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { WalletComponent } from './wallet';
import { Wares, WaresType } from '../data/wares';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor
    itemPrices: { [key in WaresType]: number }

    private random: ex.Random;

    constructor(random: ex.Random) {
        super();
        this.random = random;
        this.itemPrices = {} as { [key in WaresType]: number };
    }

    initializeBasePrices() {
        // Set random prices for all wares in our cargo filter
        const resourceFilter = this.owner.get(CargoComponent)?.resourceFilter;
        for (const [key, value] of Object.entries(Wares)) {
            if (resourceFilter && resourceFilter.includes(key as WaresType)) {
                this.itemPrices[key as WaresType] = this.random.integer(value.minPrice, value.maxPrice);
            }
        }
    }

    onAdd(owner: ex.Actor): void {
        this.initializeBasePrices();
    }

    getDetails(): string {
        return `[${this.owner.name}]
wallet ${this.owner.get(WalletComponent)?.getDetails()}
 cargo ${this.getCargoDetailsWithPrices()}`;
    }

    getPriceQuote(item: WaresType, _amount: number): number {
        return this.itemPrices[item];
    }

    getCargoDetailsWithPrices(): string {
        const cargo = this.owner.get(CargoComponent);
        let details = `${cargo.volume.toFixed(0)}/${cargo.maxVolume.toFixed(0)}m³`;
        const prices = Object.entries(this.itemPrices).map(([item, price]) => `${item.padStart(8, " ")} ${cargo.items[item as WaresType] || 0}x ¢${price.toFixed(0)}`);
        details += `\n${prices.join('\n')}`;
        return details;
    }
}
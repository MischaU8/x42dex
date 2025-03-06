import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { WalletComponent } from './wallet';
import { Wares, WaresData } from '../data/wares';
import { ProductionComponent } from './production';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor
    itemPrices: { [key in Wares]: number }

    private random: ex.Random;

    constructor(random: ex.Random) {
        super();
        this.random = random;
        this.itemPrices = {} as { [key in Wares]: number };
    }

    initializeBasePrices() {
        // Set random prices for all wares in our cargo filter
        const resourceFilter = this.owner.get(CargoComponent)?.resourceFilter;
        for (const [key, value] of Object.entries(WaresData)) {
            if (resourceFilter && resourceFilter.includes(key as Wares)) {
                this.itemPrices[key as Wares] = this.random.integer(value.minPrice, value.maxPrice);
            }
        }
    }

    onAdd(owner: ex.Actor): void {
        this.initializeBasePrices();
    }

    getDetails(): string {
        return `[${this.owner.name}]
wallet ${this.owner.get(WalletComponent)?.getDetails()}
production
${this.owner.get(ProductionComponent)?.getDetail()}
cargo ${this.getCargoDetailsWithPrices()}`;
    }

    getPriceQuote(item: Wares, _amount: number): number {
        return this.itemPrices[item];
    }

    getCargoDetailsWithPrices(): string {
        const cargo = this.owner.get(CargoComponent);
        let details = `${cargo.volume.toFixed(0)}/${cargo.maxVolume.toFixed(0)}m³`;
        const prices = Object.entries(this.itemPrices).map(([item, price]) => `${item.padStart(16, " ")} ${cargo.items[item as Wares] || 0}x ¢${price.toFixed(0)}`);
        details += `\n${prices.join('\n')}`;
        return details;
    }
}
import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { WalletComponent } from './wallet';
import { Wares, WaresType } from '../data/wares';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor
    itemPrices: { [key in WaresType]: number };

    private random: ex.Random;

    constructor(random: ex.Random) {
        super();
        this.random = random;
        this.itemPrices = {} as { [key in WaresType]: number };
        this.initializeBasePrices();
    }

    initializeBasePrices() {
        // Initialize with default values for all wares
        this.itemPrices = Object.fromEntries(
            Object.keys(Wares).map(key => [key, 0])
        ) as { [key in WaresType]: number };

        // Set random prices for all wares
        for (const [key, value] of Object.entries(Wares)) {
            this.itemPrices[key as WaresType] = this.random.integer(value.minPrice, value.maxPrice);
        }
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
        if (cargo.volume > 0) {
            const items = Object.entries(cargo.items).map(([item, amount]) => `${item.padStart(8, " ")} ${amount.toFixed(0)}x (¢${this.itemPrices[item as WaresType].toFixed(0)})`);
            details += `\n${items.join('\n')}`;
        }
        return details;
    }
}
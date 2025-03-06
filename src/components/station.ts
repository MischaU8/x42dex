import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { WalletComponent } from './wallet';
import { Wares, WaresData } from '../data/wares';
import { ProductionComponent } from './production';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor
    itemPrices: { [key in Wares]: number }
    unloadAmount: number = 1000;

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
production ${this.owner.has(ProductionComponent) ? '\n' + this.owner.get(ProductionComponent)?.getDetail() : '-'}
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

    tradeCargo(source: ex.Actor, target: ex.Actor, type: Wares, amount: number, price: number) {
        const sourceCargo = source.get(CargoComponent);
        const targetCargo = target.get(CargoComponent);
        targetCargo.addItem(type, amount);
        sourceCargo.removeItem(type, amount);
        const sourceWallet = source.get(WalletComponent);
        const targetWallet = target.get(WalletComponent);
        targetWallet.balance -= amount * price;
        sourceWallet.balance += amount * price;
    }

    tradeAllCargo(source: ex.Actor, target: ex.Actor, filter: Wares[], elapsed: number): boolean {
        const targetCargo = target.get(CargoComponent);
        const targetWallet = target.get(WalletComponent);
        const sourceCargo = source.get(CargoComponent);
        for (const [item, amount] of Object.entries(sourceCargo.items) as [Wares, number][]) {
            if (!filter.includes(item as Wares)) {
                continue;
            }
            const price = this.getPriceQuote(item, amount);
            const sourceTransferAmount = Math.min(this.unloadAmount * elapsed / 1000, amount);
            const targetSpace = targetCargo.getAvailableSpaceFor(item);
            const targetCanAffordCanAfford = targetWallet.balance / price;
            const targetTransferAmount = Math.floor(Math.min(targetSpace, targetCanAffordCanAfford));
            const transferAmount = Math.floor(Math.min(sourceTransferAmount, targetTransferAmount));
            if (transferAmount > 0) {
                this.tradeCargo(source, target, item, transferAmount, price);
                return true;
            }
        }
        return false;
    }

}
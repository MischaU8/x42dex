import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { WalletComponent } from './wallet';
import { Wares, WaresData } from '../data/wares';
import { ProductionComponent } from './production';
import { Config } from '../config';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor
    unloadAmount: number = 100;

    // initializeBasePrices() {
    //     // Set random prices for all wares in our cargo filter
    //     const resourceFilter = this.owner.get(CargoComponent)?.resourceFilter;
    //     for (const [key, value] of Object.entries(WaresData)) {
    //         if (resourceFilter && resourceFilter.includes(key as Wares)) {
    //             this.tickerItems[key as Wares] = {
    //                 ware: key as Wares,
    //                 price: this.random.integer(value.minPrice, value.maxPrice),
    //                 maxStock: this.random.integer(value.minStock, value.maxStock)
    //             };
    //         }
    //     }
    // }

    // onAdd(owner: ex.Actor): void {
    //     this.initializeBasePrices();
    // }

    getDetails(): string {
        return `[${this.owner.name}]
wallet ${this.owner.get(WalletComponent)?.getDetails()}
production ${this.owner.has(ProductionComponent) ? '\n' + this.owner.get(ProductionComponent)?.getDetail() : '-'}
cargo ${this.getCargoDetailsWithPrices()}`;
    }

    getSummary(): string {
        const wallet = this.owner.get(WalletComponent)?.getSummary() || '-';
        const production = this.owner.has(ProductionComponent)
            ? this.owner.get(ProductionComponent)?.getSummary()
            : '-';
        const cargo = this.owner.get(CargoComponent)?.getSummary() || '-';
        return `${this.owner.name.padStart(29, " ")} ${production.padStart(4, " ")} ${wallet.padStart(8, " ")} ${cargo}`;
    }

    getPriceQuote(item: Wares): number {
        const production = this.owner.get(ProductionComponent);
        const cargo = this.owner.get(CargoComponent);
        if (!production || !cargo) {
            return 0;
        }
        const stock = cargo.items[item] || 0;
        const hourlyRate = production.hourlyResources[item] || 0;
        if (hourlyRate === 0) return 0;

        const fulfillment = stock / Math.abs(hourlyRate * Config.MaxHoursOfStock);
        const minPrice = WaresData[item].minPrice;
        const maxPrice = WaresData[item].maxPrice;
        const priceRange = maxPrice - minPrice;
        return ex.clamp(minPrice + priceRange * (1 - fulfillment), minPrice, maxPrice);
    }

    calcMaxBuyAmount(item: Wares): number {
        const cargo = this.owner.get(CargoComponent);
        const targetSpace = cargo.getAvailableSpaceFor(item);
        const production = this.owner.get(ProductionComponent);
        if (!production) {
            return 0; // TODO
        }
        const hourlyRate = production.hourlyResources[item] || 0;
        if (hourlyRate >= 0) {
            return 0;
        }
        const stock = cargo.items[item] || 0;
        const targetStock = Math.abs(hourlyRate) * Config.MaxHoursOfStock;
        const shortage = Math.max(0, targetStock - stock);
        const wallet = this.owner.get(WalletComponent);
        const price = this.getPriceQuote(item);
        const canAfford = wallet.balance / price;
        return Math.floor(Math.min(targetSpace, canAfford, shortage));
    }

    calcMaxSellAmount(item: Wares): number {
        const cargo = this.owner.get(CargoComponent);
        const stock = cargo.items[item] || 0;
        if (stock === 0) {
            return 0;
        }
        const production = this.owner.get(ProductionComponent);
        if (!production) {
            return 0; // TODO
        }
        const hourlyRate = production.hourlyResources[item] || 0;
        if (hourlyRate < 0) {
            const targetStock = Math.abs(hourlyRate) * Config.MaxHoursOfStock;
            if (stock > targetStock) {
                return Math.floor(stock - targetStock);
            } else {
                return 0;
            }
        } else {
            return stock;
        }
    }

    getCargoDetailsWithPrices(): string {
        const cargo = this.owner.get(CargoComponent);
        let details = `${cargo.volume.toFixed(0)}/${cargo.maxVolume.toFixed(0)}m³`;
        const resourceFilter = this.owner.get(CargoComponent)?.resourceFilter
        const prices = resourceFilter.map(item => `${item.padStart(16, " ")} ${cargo.items[item as Wares] || 0}x ¢${this.getPriceQuote(item as Wares).toFixed(0)} hourly ${this.owner.get(ProductionComponent)?.hourlyResources[item as Wares] || 0} buy ${this.calcMaxBuyAmount(item as Wares)} sell ${this.calcMaxSellAmount(item as Wares)}`);
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

    sellAllCargoToStation(source: ex.Actor, target: ex.Actor, filter: Wares[], elapsed: number): boolean {
        const sourceCargo = source.get(CargoComponent);
        for (const [item, amount] of Object.entries(sourceCargo.items) as [Wares, number][]) {
            if (!filter.includes(item as Wares)) {
                continue;
            }
            const price = this.getPriceQuote(item);
            const sourceTransferAmount = Math.min(this.unloadAmount * elapsed / 1000, amount);
            const targetTransferAmount = this.calcMaxBuyAmount(item);
            const transferAmount = Math.floor(Math.min(sourceTransferAmount, targetTransferAmount));
            if (transferAmount > 0) {
                this.tradeCargo(source, target, item, transferAmount, price);
                return true;
            }
        }
        return false;
    }

    buyAllCargoFromStation(source: ex.Actor, target: ex.Actor, filter: Wares[], elapsed: number): boolean {
        const targetCargo = target.get(CargoComponent);
        const targetWallet = target.get(WalletComponent);
        const sourceCargo = source.get(CargoComponent);
        for (const [item, amount] of Object.entries(sourceCargo.items) as [Wares, number][]) {
            if (!filter.includes(item as Wares)) {
                continue;
            }
            const price = this.getPriceQuote(item);
            const sourceTransferAmount = Math.min(this.unloadAmount * elapsed / 1000, amount, this.calcMaxSellAmount(item));
            const targetSpace = targetCargo.getAvailableSpaceFor(item);
            const targetCanAfford = targetWallet.balance / price;
            const targetTransferAmount = Math.floor(Math.min(targetSpace, targetCanAfford));
            const transferAmount = Math.floor(Math.min(sourceTransferAmount, targetTransferAmount));
            if (transferAmount > 0) {
                this.tradeCargo(source, target, item, transferAmount, price);
                return true;
            }
        }
        return false;
    }

}
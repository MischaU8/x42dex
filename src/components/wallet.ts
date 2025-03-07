import * as ex from 'excalibur';

export class WalletComponent extends ex.Component {
    declare owner: ex.Actor

    balance: number = 0;

    constructor(balance: number = 0) {
        super();
        this.balance = balance;
    }

    getDetails(): string {
        return `¢${this.balance.toFixed(0)}`;
    }

    getSummary(): string {
        if (this.balance === 0) return '¢0';
        const units = ['', 'k', 'm', 'b'];
        const balance = this.balance;
        const unit = Math.floor(Math.log10(Math.abs(balance)) / 3);
        const scaled = balance / Math.pow(1000, unit);
        const unitLabel = units[unit] || '';
        return `¢${scaled.toFixed(unit ? 1 : 0)}${unitLabel}`;
    }
}
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
}
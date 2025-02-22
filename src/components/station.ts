import * as ex from 'excalibur';
import { CargoComponent } from './cargo';

export class StationComponent extends ex.Component {
    declare owner: ex.Actor

    getDetails(): string {
        return `[${this.owner.name}]\ncargo ${this.owner.get(CargoComponent)?.getDetails()}`
    }
}
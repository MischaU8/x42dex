import * as ex from 'excalibur';

import { Resources } from "../resources";

export enum Stations {
    refinery = 'refinery',
    shipyard = 'shipyard',
    repair = 'repair',
    trading = 'trading',
}

export const StationTypes = {
    [Stations.refinery]: {
        name: 'Refinery',
        image: Resources.StationA,
        color: ex.Color.Brown
    },
    [Stations.shipyard]: {
        name: 'Shipyard',
        image: Resources.StationB,
        color: ex.Color.Blue
    },
    [Stations.repair]: {
        name: 'Repair',
        image: Resources.StationC,
        color: ex.Color.Green
    },
    [Stations.trading]: {
        name: 'Trading',
        image: Resources.StationA,
        color: ex.Color.Red
    }
} as const;

export type StationTypeKey = keyof typeof StationTypes;

import * as ex from 'excalibur';

import { Resources } from '../resources';
import { MinableWares } from './wares';

export const AstroidTypes = {
    [MinableWares.ore]: {
        name: 'Ore',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidA,
        color: ex.Color.Brown,
    },
    [MinableWares.silicon]: {
        name: 'Silicon',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidB,
        color: ex.Color.Gray
    },
    [MinableWares.ice]: {
        name: 'Ice',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidC,
        color: ex.Color.Azure
    },
    [MinableWares.helium]: {
        name: 'Helium',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidD,
        color: ex.Color.Blue
    },
    [MinableWares.hydrogen]: {
        name: 'Hydrogen',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidD,
        color: ex.Color.Purple
    },
    [MinableWares.methane]: {
        name: 'Methane',
        minRespawnRate: 0.1,
        maxRespawnRate: 1.0,
        minAmount: 100,
        maxAmount: 1000,
        image: Resources.AstroidD,
        color: ex.Color.Chartreuse
    }
} as const;

export type AstroidTypeKey = keyof typeof AstroidTypes;

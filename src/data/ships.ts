import * as ex from 'excalibur';
import { Resources } from '../resources';
import { MinableWares, WaresType } from './wares';

export type ShipRole = 'miner' | 'transport' | 'scout' | 'patrol';

export interface ShipConfig {
    name: string;
    role: ShipRole;
    count: number;
    possibleImages: ex.ImageSource[];
    possibleColors: ex.Color[];
    components: {
        cargo?: {
            maxVolume?: number;
            resourceFilter: WaresType[];
        };
        wallet?: {
            initialBalance?: number;
        };
        autopilot?: boolean;
        autominer?: {
            minMineAmount?: number;
            maxMineAmount?: number;
            minUnloadAmount?: number;
            maxUnloadAmount?: number;
            minUnloadThreshold?: number;
            maxUnloadThreshold?: number;
            minTopNAstroids?: number;
            maxTopNAstroids?: number;
            minTopNStations?: number;
            maxTopNStations?: number;
            initialRangeMultiplier?: number;
        };
        autoscout?: {
            topNObjects?: number;
            rememberNObjects?: number;
            initialRangeMultiplier?: number;
        };
    };
}

const DefaultAutominerConfig = {
    minMineAmount: 10,
    maxMineAmount: 20,
    minUnloadAmount: 100,
    maxUnloadAmount: 200,
    minUnloadThreshold: 0.8,
    maxUnloadThreshold: 0.9,
    minTopNAstroids: 3,
    maxTopNAstroids: 5,
    minTopNStations: 2,
    maxTopNStations: 3,
    initialRangeMultiplier: 2
} as const;

export const DefaultShipConfigs: ShipConfig[] = [
    {
        name: 'Scout',
        role: 'scout',
        count: 50,
        possibleImages: [Resources.ShipA, Resources.ShipB],
        possibleColors: [ex.Color.Yellow, ex.Color.White, ex.Color.Red],
        components: {
            autopilot: true,
            autoscout: {
                initialRangeMultiplier: 3,
                topNObjects: 3,
                rememberNObjects: 15
            }
        }
    },
    {
        name: 'Solid Miner',
        role: 'miner',
        count: 30,
        possibleImages: [Resources.ShipE, Resources.ShipG],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 1000,
                resourceFilter: [MinableWares.ore, MinableWares.silicon]
            },
            wallet: { initialBalance: 0 },
            autopilot: true,
            autominer: DefaultAutominerConfig
        }
    },
    {
        name: 'Ice Miner',
        role: 'miner',
        count: 15,
        possibleImages: [Resources.ShipE, Resources.ShipG],
        possibleColors: [ex.Color.White],
        components: {
            cargo: {
                maxVolume: 1000,
                resourceFilter: [MinableWares.ice]
            },
            wallet: { initialBalance: 0 },
            autopilot: true,
            autominer: DefaultAutominerConfig
        }
    },
    {
        name: 'Gas Miner',
        role: 'miner',
        count: 45,
        possibleImages: [Resources.ShipE, Resources.ShipG],
        possibleColors: [ex.Color.Magenta],
        components: {
            cargo: {
                maxVolume: 1000,
                resourceFilter: [MinableWares.helium, MinableWares.hydrogen, MinableWares.methane]
            },
            wallet: { initialBalance: 0 },
            autopilot: true,
            autominer: DefaultAutominerConfig
        }
    }
    // Add more ship configurations as needed
];
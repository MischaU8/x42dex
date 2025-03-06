import * as ex from 'excalibur';
import { Resources } from '../resources';
import { Wares, Energy, RefinedGoods, Gases, Minerals, Agricultural, Hightech, Shiptech } from './wares';

export type ShipRole = 'miner' | 'transport' | 'scout' | 'patrol';

export interface ShipConfig {
    name: string;
    role: ShipRole;
    count: number;
    possibleImages: ex.ImageSource[];
    possibleColors: ex.Color[];
    components: {
        movement?: {
            maxVelocity: number;
            maxAcceleration: number;
            maxDeceleration: number;
            maxAngularVelocity: number;
        };
        cargo?: {
            maxVolume?: number;
            resourceFilter: Wares[];
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
        autotrader?: {
            tradeFilter: Wares[];
            topNBuyers?: number;
            topNSellers?: number;
            initialRangeMultiplier?: number;
        };
    };
    index?: number;
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

// Add default movement config
const DefaultMovementConfig = {
    maxVelocity: 321,
    maxAcceleration: 169,
    maxDeceleration: 169,
    maxAngularVelocity: 1.17, // 67 degrees per second
} as const;

export const DefaultShipConfigs: ShipConfig[] = [
    {
        name: 'Player',
        role: 'scout',
        count: 1,
        possibleImages: [Resources.ShipF],
        possibleColors: [ex.Color.Green],
        components: {
            movement: DefaultMovementConfig,
            autopilot: true,
        }
    },
    {
        name: 'Scout',
        role: 'scout',
        count: 0,   // disable for now
        possibleImages: [Resources.ShipA, Resources.ShipB],
        possibleColors: [ex.Color.Yellow, ex.Color.White, ex.Color.Red],
        components: {
            movement: {
                ...DefaultMovementConfig,
                maxVelocity: 400, // Scouts are faster
                maxAcceleration: 200
            },
            autopilot: true,
            autoscout: {
                initialRangeMultiplier: 3,
                topNObjects: 3,
                rememberNObjects: 15
            }
        }
    },
    {
        name: 'Mineral Miner',
        role: 'miner',
        count: 10,
        possibleImages: [Resources.ShipE, Resources.ShipG],
        possibleColors: [ex.Color.Brown],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Minerals
            },
            wallet: { initialBalance: 0 },
            autopilot: true,
            autominer: DefaultAutominerConfig
        }
    },
    {
        name: 'Gas Miner',
        role: 'miner',
        count: 10,
        possibleImages: [Resources.ShipE, Resources.ShipG],
        possibleColors: [ex.Color.Magenta],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Gases
            },
            wallet: { initialBalance: 0 },
            autopilot: true,
            autominer: DefaultAutominerConfig
        }
    },
    {
        name: 'Energy Trader',
        role: 'transport',
        count: 20,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Yellow],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Energy
            },
            wallet: { initialBalance: 20_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Energy,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Refined Goods Trader',
        role: 'transport',
        count: 10,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Gray],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: RefinedGoods
            },
            wallet: { initialBalance: 20_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: RefinedGoods,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Gases Trader',
        role: 'transport',
        count: 5,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Magenta],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Gases
            },
            wallet: { initialBalance: 50_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Gases,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Minerals Trader',
        role: 'transport',
        count: 5,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Brown],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Minerals
            },
            wallet: { initialBalance: 50_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Minerals,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Agricultural Trader',
        role: 'transport',
        count: 5,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Green],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Agricultural
            },
            wallet: { initialBalance: 50_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Agricultural,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Hightech Trader',
        role: 'transport',
        count: 5,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Pink],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Hightech
            },
            wallet: { initialBalance: 50_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Hightech,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    },
    {
        name: 'Shiptech Trader',
        role: 'transport',
        count: 5,
        possibleImages: [Resources.ShipH],
        possibleColors: [ex.Color.Purple],
        components: {
            movement: DefaultMovementConfig,
            cargo: {
                maxVolume: 2500,
                resourceFilter: Shiptech
            },
            wallet: { initialBalance: 50_000 },
            autopilot: true,
            autotrader: {
                tradeFilter: Shiptech,
                topNBuyers: 2,
                topNSellers: 2,
                initialRangeMultiplier: 16
            }
        }
    }

    // Add more ship configurations as needed
];
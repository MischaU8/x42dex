import * as ex from 'excalibur';

import { Resources } from "../resources";
import { WaresType, RefinedWares, MinableWares, EnergyWares, HighTechWares } from './wares';

export type StationType = 'production' | 'equipmentdock' | 'shipyard' | 'trade' | 'wharf';

export interface StationConfig {
    name: string;
    type: StationType;
    count: number;
    possibleImages: ex.ImageSource[];
    possibleColors: ex.Color[];
    components: {
        cargo?: {
            maxVolume?: number;
            resourceFilter: WaresType[];
        };
        production?: {
            [key in WaresType]?: number;
        };
        wallet?: {
            initialBalance?: number;
        };
    };
    index?: number;
}

export const DefaultStationConfigs: StationConfig[] = [
    {
        name: 'Trading Station',
        type: 'trade',
        count: 5,
        possibleImages: [Resources.StationA],
        possibleColors: [ex.Color.ExcaliburBlue],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [MinableWares.ore, MinableWares.silicon]
            },
            wallet: {
                initialBalance: 1_000_000
            }
        }
    },
    {
        name: 'Solar Power Plant',
        type: 'production',
        count: 5,
        possibleImages: [Resources.StationB],
        possibleColors: [ex.Color.Green],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [EnergyWares.energycells]
            },
            production: {
                [EnergyWares.energycells]: 1
            },
            wallet: {
                initialBalance: 0
            }
        }
    },
    {
        name: 'Ore Refinery',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [MinableWares.ore, RefinedWares.refinedmetals]
            },
            production: {
                [RefinedWares.refinedmetals]: 1
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    },
    {
        name: 'Graphene Refinery',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [EnergyWares.energycells, MinableWares.methane, RefinedWares.graphene]
            },
            production: {
                [RefinedWares.graphene]: 1
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    },
    {
        name: 'Silicon Wafer Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [EnergyWares.energycells, MinableWares.silicon, RefinedWares.siliconwafers]
            },
            production: {
                [RefinedWares.siliconwafers]: 1
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    },
    {
        name: 'Antimatter Cells Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [EnergyWares.energycells, MinableWares.hydrogen, RefinedWares.antimattercells]
            },
            production: {
                [RefinedWares.antimattercells]: 1
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    },
    {
        name: 'Advanced Composites Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [EnergyWares.energycells, RefinedWares.graphene, RefinedWares.refinedmetals, HighTechWares.advancedcomposites]
            },
            production: {
                [HighTechWares.advancedcomposites]: 1
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    }
] as const;

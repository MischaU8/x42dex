import * as ex from 'excalibur';

import { Resources } from "../resources";
import { Wares } from './wares';

export type StationType = 'production' | 'equipmentdock' | 'shipyard' | 'trade' | 'wharf';


export type ProductionConfig = {
    jobs: Partial<{ [key in Wares]: number }>;
    startJobs?: boolean;
    startCargo?: boolean;
}

export type WalletConfig = {
    initialBalance?: number;
}

export interface StationConfig {
    name: string;
    type: StationType;
    count: number;
    possibleImages: ex.ImageSource[];
    possibleColors: ex.Color[];
    components: {
        cargo?: {
            maxVolume?: number;
            resourceFilter: Wares[];
            startAmount?: Partial<{ [key in Wares]: {min: number, max: number} }>;
        };
        production?: ProductionConfig;
        wallet?: WalletConfig;
    };
    index?: number;
}

const DefaultProductionConfig: ProductionConfig = {
    jobs: {},
    startJobs: true,
    startCargo: true,
}

const DefaultWalletConfig: WalletConfig = {
    initialBalance: 100_000,
}

export const DefaultStationConfigs: StationConfig[] = [
    {
        name: 'Advanced Composites Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.refinedmetals, Wares.advancedcomposites],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.advancedcomposites]: 1
                },
            },
            wallet: DefaultWalletConfig,
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
                maxVolume: 200_000,
                resourceFilter: [Wares.energycells, Wares.hydrogen, Wares.antimattercells],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.antimattercells]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Engine Parts Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.antimattercells, Wares.energycells, Wares.refinedmetals, Wares.engineparts],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.engineparts]: 1
                },
            },
            wallet: DefaultWalletConfig,
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.methane, Wares.graphene],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.graphene]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Hull Parts Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.refinedmetals, Wares.hullparts],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.hullparts]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Ice Refinery',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.White],
        components: {
            cargo: {
                maxVolume: 200_000,
                resourceFilter: [Wares.energycells, Wares.ice, Wares.water],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.water]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Microchips Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.siliconwafers, Wares.microchips],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.microchips]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Ore Refinery',
        type: 'production',
        count: 6,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 200_000,
                resourceFilter: [Wares.energycells, Wares.ore, Wares.refinedmetals],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.refinedmetals]: 2
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Plasma Conductors Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.superfluidcoolant, Wares.plasmaconductors],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.plasmaconductors]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Quantum Tubes Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.superfluidcoolant, Wares.quantumtubes],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.quantumtubes]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Scanning Arrays Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.refinedmetals, Wares.siliconwafers, Wares.scanningarrays],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.scanningarrays]: 1
                },
            },
            wallet: DefaultWalletConfig,
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.silicon, Wares.siliconwafers],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.siliconwafers]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Smart Chips Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Brown],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.siliconwafers, Wares.smartchips],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.smartchips]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Solar Power Plant',
        type: 'production',
        count: 10,
        possibleImages: [Resources.StationB],
        possibleColors: [ex.Color.Yellow],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.energycells]: 2
                },
            },
            wallet: {
                ...DefaultWalletConfig,
                initialBalance: 0,
            }
        }
    },
    {
        name: 'Superfluid Coolant Factory',
        type: 'production',
        count: 3,
        possibleImages: [Resources.StationC],
        possibleColors: [ex.Color.Blue],
        components: {
            cargo: {
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.helium, Wares.superfluidcoolant],
            },
            production: {
                ...DefaultProductionConfig,
                jobs: {
                    [Wares.superfluidcoolant]: 1
                },
            },
            wallet: DefaultWalletConfig,
        }
    },
    {
        name: 'Trading Station',
        type: 'trade',
        count: 5,
        possibleImages: [Resources.StationA],
        possibleColors: [ex.Color.ExcaliburBlue],
        components: {
            cargo: {
                maxVolume: 1_000_000,
                resourceFilter: [Wares.energycells, Wares.ice, Wares.ore, Wares.silicon],
                startAmount: {
                    [Wares.energycells]: {min: 1000, max: 5000},
                    [Wares.ice]: {min: 1000, max: 5000},
                    [Wares.ore]: {min: 1000, max: 5000},
                    [Wares.silicon]: {min: 1000, max: 2000},
                },
            },
            wallet: {
                ...DefaultWalletConfig,
                initialBalance: 1_000_000,
            }
        }
    }
] as const;

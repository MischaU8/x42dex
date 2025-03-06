import * as ex from 'excalibur';

import { Resources } from "../resources";
import { Wares } from './wares';

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
            resourceFilter: Wares[];
            startAmount?: Partial<{ [key in Wares]: {min: number, max: number} }>;
        };
        production?: {
            jobs: Partial<{ [key in Wares]: number }>;
            startJobs?: boolean;
        };
        wallet?: {
            initialBalance?: number;
        };
    };
    index?: number;
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.refinedmetals, Wares.advancedcomposites],
                startAmount: {
                    [Wares.energycells]: {min: 50, max: 100},
                    [Wares.graphene]: {min: 80, max: 160},
                    [Wares.refinedmetals]: {min: 80, max: 160},
                    [Wares.advancedcomposites]: {min: 54, max: 108},
                },
            },
            production: {
                jobs: {
                    [Wares.advancedcomposites]: 1
                },
                startJobs: true,
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
                resourceFilter: [Wares.energycells, Wares.hydrogen, Wares.antimattercells],
                startAmount: {
                    [Wares.energycells]: {min: 100, max: 200},
                    [Wares.hydrogen]: {min: 320, max: 640},
                    [Wares.antimattercells]: {min: 99, max: 198},
                },
            },
            production: {
                jobs: {
                    [Wares.antimattercells]: 1
                },
                startJobs: true,
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
                resourceFilter: [Wares.energycells, Wares.methane, Wares.graphene],
                startAmount: {
                    [Wares.energycells]: {min: 80, max: 160},
                    [Wares.methane]: {min: 320, max: 640},
                    [Wares.graphene]: {min: 96, max: 192},
                },
            },
            production: {
                jobs: {
                    [Wares.graphene]: 1
                },
                startJobs: true,
            },
            wallet: {
                initialBalance: 100_000
            }
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.ice, Wares.water],
                startAmount: {
                    [Wares.energycells]: {min: 60, max: 120},
                    [Wares.ice]: {min: 320, max: 640},
                    [Wares.water]: {min: 193, max: 386},
                },
            },
            production: {
                jobs: {
                    [Wares.water]: 1
                },
                startJobs: true,
            },
            wallet: {
                initialBalance: 100_000
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
                resourceFilter: [Wares.energycells, Wares.ore, Wares.refinedmetals],
                startAmount: {
                    [Wares.energycells]: {min: 90, max: 180},
                    [Wares.ore]: {min: 240, max: 480},
                    [Wares.refinedmetals]: {min: 88, max: 176},
                },
            },
            production: {
                jobs: {
                    [Wares.refinedmetals]: 1
                },
                startJobs: true,
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
                resourceFilter: [Wares.energycells, Wares.silicon, Wares.siliconwafers],
                startAmount: {
                    [Wares.energycells]: {min: 90, max: 180},
                    [Wares.silicon]: {min: 240, max: 480},
                    [Wares.siliconwafers]: {min: 107, max: 214},
                },
            },
            production: {
                jobs: {
                    [Wares.siliconwafers]: 1
                },
                startJobs: true,
            },
            wallet: {
                initialBalance: 100_000
            }
        }
    },
    {
        name: 'Solar Power Plant',
        type: 'production',
        count: 5,
        possibleImages: [Resources.StationB],
        possibleColors: [ex.Color.Yellow],
        components: {
            cargo: {
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells],
                startAmount: {
                    [Wares.energycells]: {min: 175, max: 350},
                },
            },
            production: {
                jobs: {
                    [Wares.energycells]: 1
                },
                startJobs: true,
            },
            wallet: {
                initialBalance: 0
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.helium, Wares.superfluidcoolant],
                startAmount: {
                    [Wares.energycells]: {min: 60, max: 120},
                    [Wares.helium]: {min: 320, max: 640},
                    [Wares.superfluidcoolant]: {min: 95, max: 190},
                },
            },
            production: {
                jobs: {
                    [Wares.superfluidcoolant]: 1
                },
                startJobs: true,
            },
            wallet: {
                initialBalance: 100_000
            }
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
                maxVolume: 100_000,
                resourceFilter: [Wares.ore, Wares.silicon],
                startAmount: {
                    [Wares.ore]: {min: 1000, max: 5000},
                    [Wares.silicon]: {min: 1000, max: 2000},
                },
            },
            wallet: {
                initialBalance: 1_000_000
            }
        }
    }
] as const;

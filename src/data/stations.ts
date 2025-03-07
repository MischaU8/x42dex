import * as ex from 'excalibur';

import { Resources } from "../resources";
import { Wares } from './wares';

export type StationType = 'production' | 'equipmentdock' | 'shipyard' | 'trade' | 'wharf';


export type ProductionConfig = {
    jobs: Partial<{ [key in Wares]: number }>;
    startJobs?: boolean;
    startCargo?: boolean;
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
        wallet: {
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.refinedmetals, Wares.advancedcomposites],
            },
            production: {
                jobs: {
                    [Wares.advancedcomposites]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
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
                maxVolume: 200_000,
                resourceFilter: [Wares.energycells, Wares.hydrogen, Wares.antimattercells],
            },
            production: {
                jobs: {
                    [Wares.antimattercells]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.engineparts]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.methane, Wares.graphene],
            },
            production: {
                jobs: {
                    [Wares.graphene]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.hullparts]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
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
                maxVolume: 200_000,
                resourceFilter: [Wares.energycells, Wares.ice, Wares.water],
            },
            production: {
                jobs: {
                    [Wares.water]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.microchips]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.refinedmetals]: 2
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.plasmaconductors]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.quantumtubes]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.scanningarrays]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.silicon, Wares.siliconwafers],
            },
            production: {
                jobs: {
                    [Wares.siliconwafers]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.smartchips]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
            }
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
                jobs: {
                    [Wares.energycells]: 2
                },
                startJobs: true,
                startCargo: true,
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
                maxVolume: 100_000,
                resourceFilter: [Wares.energycells, Wares.helium, Wares.superfluidcoolant],
            },
            production: {
                jobs: {
                    [Wares.superfluidcoolant]: 1
                },
                startJobs: true,
                startCargo: true,
            },
            wallet: {
                initialBalance: 250_000
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
                initialBalance: 1_000_000
            }
        }
    }
] as const;

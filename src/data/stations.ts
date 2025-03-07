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
                maxVolume: 50_000,
                resourceFilter: [Wares.antimattercells, Wares.energycells, Wares.refinedmetals, Wares.engineparts],
                startAmount: {
                    [Wares.antimattercells]: {min: 80, max: 160},
                    [Wares.energycells]: {min: 60, max: 120},
                    [Wares.refinedmetals]: {min: 96, max: 192},
                    [Wares.engineparts]: {min: 208, max: 416},
                },
            },
            production: {
                jobs: {
                    [Wares.engineparts]: 1
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.refinedmetals, Wares.hullparts],
                startAmount: {
                    [Wares.energycells]: {min: 80, max: 160},
                    [Wares.graphene]: {min: 40, max: 80},
                    [Wares.refinedmetals]: {min: 280, max: 560},
                    [Wares.hullparts]: {min: 294, max: 588},
                },
            },
            production: {
                jobs: {
                    [Wares.hullparts]: 1
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.siliconwafers, Wares.microchips],
                startAmount: {
                    [Wares.energycells]: {min: 50, max: 100},
                    [Wares.siliconwafers]: {min: 200, max: 400},
                    [Wares.microchips]: {min: 72, max: 144},
                },
            },
            production: {
                jobs: {
                    [Wares.microchips]: 1
                },
                startJobs: true,
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
                    [Wares.refinedmetals]: 2
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.superfluidcoolant, Wares.plasmaconductors],
                startAmount: {
                    [Wares.energycells]: {min: 60, max: 120},
                    [Wares.graphene]: {min: 96, max: 192},
                    [Wares.superfluidcoolant]: {min: 140, max: 280},
                    [Wares.plasmaconductors]: {min: 44, max: 88},
                },
            },
            production: {
                jobs: {
                    [Wares.plasmaconductors]: 1
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.graphene, Wares.superfluidcoolant, Wares.quantumtubes],
                startAmount: {
                    [Wares.energycells]: {min: 40, max: 80},
                    [Wares.graphene]: {min: 116, max: 232},
                    [Wares.superfluidcoolant]: {min: 30, max: 60},
                    [Wares.quantumtubes]: {min: 43, max: 86},
                },
            },
            production: {
                jobs: {
                    [Wares.quantumtubes]: 1
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.refinedmetals, Wares.siliconwafers, Wares.scanningarrays],
                startAmount: {
                    [Wares.energycells]: {min: 60, max: 120},
                    [Wares.refinedmetals]: {min: 100, max: 200},
                    [Wares.siliconwafers]: {min: 60, max: 120},
                    [Wares.scanningarrays]: {min: 40, max: 80},
                },
            },
            production: {
                jobs: {
                    [Wares.scanningarrays]: 1
                },
                startJobs: true,
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
                maxVolume: 50_000,
                resourceFilter: [Wares.energycells, Wares.siliconwafers, Wares.smartchips],
                startAmount: {
                    [Wares.energycells]: {min: 50, max: 100},
                    [Wares.siliconwafers]: {min: 20, max: 40},
                    [Wares.smartchips]: {min: 143, max: 286},
                },
            },
            production: {
                jobs: {
                    [Wares.smartchips]: 1
                },
                startJobs: true,
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
                startAmount: {
                    [Wares.energycells]: {min: 1750, max: 3500},
                },
            },
            production: {
                jobs: {
                    [Wares.energycells]: 4
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

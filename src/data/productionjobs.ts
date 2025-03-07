import { Wares } from "./wares";


export type ProductionJob = {
    tier: number;
    cycleTime: number;
    batchSize: number;
    input: Partial<{ [key in Wares]: number }>;
    output: Wares
}

export const ProductionJobs: Partial<{ [key in Wares]: ProductionJob }> = {
    [Wares.advancedcomposites]: {
        tier: 2,
        cycleTime: 5 * 60,
        batchSize: 54,
        input: {
            [Wares.energycells]: 50,
            [Wares.graphene]: 80,
            [Wares.refinedmetals]: 80,
        },
        output: Wares.advancedcomposites
    },
    [Wares.advancedelectronics]: {
        tier: 3,
        cycleTime: 12 * 60,
        batchSize: 54,
        input: {
            [Wares.energycells]: 60,
            [Wares.microchips]: 44,
            [Wares.quantumtubes]: 20,
        },
        output: Wares.advancedelectronics
    },
    [Wares.antimattercells]: {
        tier: 1,
        cycleTime: 2 * 60,
        batchSize: 133,
        input: {
            [Wares.energycells]: 100,
            [Wares.hydrogen]: 320,
        },
        output: Wares.antimattercells
    },
    [Wares.antimatterconverters]: {
        tier: 3,
        cycleTime: 5 * 60,
        batchSize: 133,
        input: {
            [Wares.advancedcomposites]: 20,
            [Wares.energycells]: 80,
            [Wares.microchips]: 30,
        },
        output: Wares.antimatterconverters
    },
    [Wares.claytronics]: {
        tier: 3,
        cycleTime: 15 * 60,
        batchSize: 108,
        input: {
            [Wares.antimattercells]: 100,
            [Wares.energycells]: 140,
            [Wares.microchips]: 160,
            [Wares.quantumtubes]: 100,
        },
        output: Wares.claytronics
    },
    [Wares.dronecomponents]: {
        tier: 3,
        cycleTime: 20 * 60,
        batchSize: 105,
        input: {
            [Wares.energycells]: 60,
            [Wares.engineparts]: 20,
            [Wares.hullparts]: 20,
            [Wares.microchips]: 20,
            [Wares.scanningarrays]: 40,
        },
        output: Wares.dronecomponents
    },
    [Wares.energycells]: {
        tier: 1,
        cycleTime: 60,
        batchSize: 175,
        input: {},
        output: Wares.energycells
    },
    [Wares.engineparts]: {
        tier: 2,
        cycleTime: 15 * 60,
        batchSize: 208,
        input: {
            [Wares.antimattercells]: 80,
            [Wares.energycells]: 60,
            [Wares.refinedmetals]: 96
        },
        output: Wares.engineparts
    },
    [Wares.fieldcoils]: {
        tier: 3,
        cycleTime: 10 * 60,
        batchSize: 175,
        input: {
            [Wares.energycells]: 60,
            [Wares.plasmaconductors]: 40,
            [Wares.quantumtubes]: 43,
        },
        output: Wares.fieldcoils
    },
    [Wares.graphene]: {
        tier: 1,
        cycleTime: 4 * 60,
        batchSize: 96,
        input: {
            [Wares.energycells]: 80,
            [Wares.methane]: 320,
        },
        output: Wares.graphene
    },
    [Wares.hullparts]: {
        tier: 2,
        cycleTime: 15 * 60,
        batchSize: 294,
        input: {
            [Wares.energycells]: 80,
            [Wares.graphene]: 40,
            [Wares.refinedmetals]: 280,
        },
        output: Wares.hullparts
    },
    [Wares.microchips]: {
        tier: 2,
        cycleTime: 10 * 60,
        batchSize: 72,
        input: {
            [Wares.energycells]: 50,
            [Wares.siliconwafers]: 200,
        },
        output: Wares.microchips
    },
    [Wares.missilecomponents]: {
        tier: 3,
        cycleTime: 15 * 60,
        batchSize: 281,
        input: {
            [Wares.advancedcomposites]: 2,
            [Wares.energycells]: 20,
            [Wares.hullparts]: 2,
        },
        output: Wares.missilecomponents
    },
    [Wares.plasmaconductors]: {
        tier: 2,
        cycleTime: 15 * 60,
        batchSize: 44,
        input: {
            [Wares.energycells]: 60,
            [Wares.graphene]: 96,
            [Wares.superfluidcoolant]: 140,
        },
        output: Wares.plasmaconductors
    },
    [Wares.quantumtubes]: {
        tier: 2,
        cycleTime: 12 * 60,
        batchSize: 94,
        input: {
            [Wares.energycells]: 40,
            [Wares.graphene]: 116,
            [Wares.superfluidcoolant]: 30,
        },
        output: Wares.quantumtubes
    },
    [Wares.refinedmetals]: {
        tier: 1,
        cycleTime: 2.5 * 60,
        batchSize: 88,
        input: {
            [Wares.energycells]: 90,
            [Wares.ore]: 240
        },
        output: Wares.refinedmetals
    },
    [Wares.scanningarrays]: {
        tier: 2,
        cycleTime: 10 * 60,
        batchSize: 36,
        input: {
            [Wares.energycells]: 60,
            [Wares.refinedmetals]: 100,
            [Wares.siliconwafers]: 60,
        },
        output: Wares.scanningarrays
    },
    [Wares.shieldcomponents]: {
        tier: 3,
        cycleTime: 20 * 60,
        batchSize: 193,
        input: {
            [Wares.energycells]: 70,
            [Wares.plasmaconductors]: 20,
            [Wares.quantumtubes]: 20,
        },
        output: Wares.shieldcomponents
    },
    [Wares.siliconwafers]: {
        tier: 1,
        cycleTime: 3 * 60,
        batchSize: 107,
        input: {
            [Wares.energycells]: 90,
            [Wares.silicon]: 240
        },
        output: Wares.siliconwafers
    },
    [Wares.smartchips]: {
        tier: 2,
        cycleTime: 10 * 60,
        batchSize: 143,
        input: {
            [Wares.energycells]: 50,
            [Wares.siliconwafers]: 20,
        },
        output: Wares.smartchips
    },
    [Wares.superfluidcoolant]: {
        tier: 1,
        cycleTime: 4 * 60,
        batchSize: 95,
        input: {
            [Wares.energycells]: 60,
            [Wares.helium]: 320
        },
        output: Wares.superfluidcoolant
    },
    [Wares.turretcomponents]: {
        tier: 3,
        cycleTime: 30 * 60,
        batchSize: 170,
        input: {
            [Wares.energycells]: 60,
            [Wares.microchips]: 20,
            [Wares.quantumtubes]: 20,
            [Wares.scanningarrays]: 10,
        },
        output: Wares.turretcomponents
    },
    [Wares.water]: {
        tier: 1,
        cycleTime: 2 * 60,
        batchSize: 193,
        input: {
            [Wares.energycells]: 60,
            [Wares.ice]: 320
        },
        output: Wares.water
    },
    [Wares.weaponcomponents]: {
        tier: 3,
        cycleTime: 30 * 60,
        batchSize: 170,
        input: {
            [Wares.energycells]: 60,
            [Wares.hullparts]: 20,
            [Wares.plasmaconductors]: 30,
        },
        output: Wares.weaponcomponents
    }
} as const;

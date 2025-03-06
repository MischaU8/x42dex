import { Wares } from "./wares";


export type ProductionJob = {
    cycleTime: number;
    batchSize: number;
    input: Partial<{ [key in Wares]: number }>;
    output: Wares
}

export const ProductionJobs: Partial<{ [key in Wares]: ProductionJob }> = {
    [Wares.advancedcomposites]: {
        cycleTime: 5 * 60,
        batchSize: 54,
        input: {
            [Wares.energycells]: 50,
            [Wares.graphene]: 80,
            [Wares.refinedmetals]: 80,
        },
        output: Wares.advancedcomposites
    },
    [Wares.antimattercells]: {
        cycleTime: 2 * 60,
        batchSize: 133,
        input: {
            [Wares.energycells]: 100,
            [Wares.hydrogen]: 320,
        },
        output: Wares.antimattercells
    },
    [Wares.energycells]: {
        cycleTime: 60,
        batchSize: 175,
        input: {},
        output: Wares.energycells
    },
    [Wares.engineparts]: {
        cycleTime: 15 * 60,
        batchSize: 208,
        input: {
            [Wares.antimattercells]: 80,
            [Wares.energycells]: 60,
            [Wares.refinedmetals]: 96
        },
        output: Wares.engineparts
    },
    [Wares.graphene]: {
        cycleTime: 4 * 60,
        batchSize: 96,
        input: {
            [Wares.energycells]: 80,
            [Wares.methane]: 320,
        },
        output: Wares.graphene
    },
    [Wares.hullparts]: {
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
        cycleTime: 10 * 60,
        batchSize: 72,
        input: {
            [Wares.energycells]: 50,
            [Wares.siliconwafers]: 200,
        },
        output: Wares.microchips
    },
    [Wares.plasmaconductors]: {
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
        cycleTime: 2.5 * 60,
        batchSize: 88,
        input: {
            [Wares.energycells]: 90,
            [Wares.ore]: 240
        },
        output: Wares.refinedmetals
    },
    [Wares.scanningarrays]: {
        cycleTime: 10 * 60,
        batchSize: 36,
        input: {
            [Wares.energycells]: 60,
            [Wares.refinedmetals]: 100,
            [Wares.siliconwafers]: 60,
        },
        output: Wares.scanningarrays
    },
    [Wares.siliconwafers]: {
        cycleTime: 3 * 60,
        batchSize: 107,
        input: {
            [Wares.energycells]: 90,
            [Wares.silicon]: 240
        },
        output: Wares.siliconwafers
    },
    [Wares.smartchips]: {
        cycleTime: 10 * 60,
        batchSize: 143,
        input: {
            [Wares.energycells]: 50,
            [Wares.siliconwafers]: 20,
        },
        output: Wares.smartchips
    },
    [Wares.superfluidcoolant]: {
        cycleTime: 4 * 60,
        batchSize: 95,
        input: {
            [Wares.energycells]: 60,
            [Wares.helium]: 320
        },
        output: Wares.superfluidcoolant
    },
    [Wares.water]: {
        cycleTime: 2 * 60,
        batchSize: 193,
        input: {
            [Wares.energycells]: 60,
            [Wares.ice]: 320
        },
        output: Wares.water
    }
} as const;

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
    [Wares.graphene]: {
        cycleTime: 4 * 60,
        batchSize: 96,
        input: {
            [Wares.energycells]: 80,
            [Wares.methane]: 320,
        },
        output: Wares.graphene
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
    [Wares.siliconwafers]: {
        cycleTime: 3 * 60,
        batchSize: 107,
        input: {
            [Wares.energycells]: 90,
            [Wares.silicon]: 240
        },
        output: Wares.siliconwafers
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

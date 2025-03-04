export enum EnergyWares {
    energycells = 'energycells'
}

export enum MinableWares {
    ore = 'ore',
    silicon = 'silicon',
    ice = 'ice',
    helium = 'helium',
    hydrogen = 'hydrogen',
    methane = 'methane'
}

export enum RefinedWares {
    antimattercells = 'antimattercells',
    graphene = 'graphene',
    refinedmetals = 'refinedmetals',
    siliconwafers = 'siliconwafers',
    superfluidcoolant = 'superfluidcoolant'
}

export enum ShipTechWares {
    advancedelectronics = 'advancedelectronics',
    antimatterconverters = 'antimatterconverters',
    claytronics = 'claytronics',
    dronecomponents = 'dronecomponents',
    fieldcoils = 'fieldcoils',
    missilecomponents = 'missilecomponents',
    shieldcomponents = 'shieldcomponents',
    smartchips = 'smartchips',
    turrentcomponents = 'turrentcomponents',
    weaponcomponents = 'weaponcomponents'
}

export enum HighTechWares {
    advancedcomposites = 'advancedcomposites',
    engineparts = 'engineparts',
    hullparts = 'hullparts',
    microchips = 'microchips',
    plasmaconductors = 'plasmaconductors',
    quantumtubes = 'quantumtubes',
    scanningarrays = 'scanningarrays',
}

export type WaresType = EnergyWares | MinableWares | RefinedWares | ShipTechWares | HighTechWares

export type WaresData = {
    name: string;
    minPrice: number;
    avgPrice: number;
    maxPrice: number;
    volume: number;
}

export const Wares = {
    [HighTechWares.advancedcomposites]: {
        name: 'Advanced Composites',
        minPrice: 432,
        avgPrice: 540,
        maxPrice: 648,
        volume: 32,
    },
    [ShipTechWares.advancedelectronics]: {
        name: 'Advanced Electronics',
        minPrice: 710,
        avgPrice: 1014,
        maxPrice: 1318,
        volume: 30,
    },
    [RefinedWares.antimattercells]: {
        name: 'Antimatter Cells',
        minPrice: 121,
        avgPrice: 202,
        maxPrice: 283,
        volume: 18,
    },
    [ShipTechWares.antimatterconverters]: {
        name: 'Antimatter Converters',
        minPrice: 248,
        avgPrice: 354,
        maxPrice: 461,
        volume: 10,
    },
    [ShipTechWares.claytronics]: {
        name: 'Claytronics',
        minPrice: 1734,
        avgPrice: 2040,
        maxPrice: 2346,
        volume: 24,
    },
    [ShipTechWares.dronecomponents]: {
        name: 'Drone Components',
        minPrice: 685,
        avgPrice: 914,
        maxPrice: 1142,
        volume: 30,
    },
    [EnergyWares.energycells]: {
        name: 'Energy Cells',
        minPrice: 10,
        avgPrice: 16,
        maxPrice: 22,
        volume: 1,
    },
    [HighTechWares.engineparts]: {
        name: 'Engine Parts',
        minPrice: 128,
        avgPrice: 182,
        maxPrice: 237,
        volume: 15,
    },
    [ShipTechWares.fieldcoils]: {
        name: 'Field Coils',
        minPrice: 247,
        avgPrice: 412,
        maxPrice: 576,
        volume: 15,
    },
    [RefinedWares.graphene]: {
        name: 'Graphene',
        minPrice: 100,
        avgPrice: 166,
        maxPrice: 233,
        volume: 20,
    },
    [MinableWares.helium]: {
        name: 'Helium',
        minPrice: 37,
        avgPrice: 44,
        maxPrice: 51,
        volume: 6,
    },
    [HighTechWares.hullparts]: {
        name: 'Hull Parts',
        minPrice: 146,
        avgPrice: 209,
        maxPrice: 272,
        volume: 12,
    },
    [MinableWares.hydrogen]: {
        name: 'Hydrogen',
        minPrice: 49,
        avgPrice: 58,
        maxPrice: 67,
        volume: 6,
    },
    [MinableWares.ice]: {
        name: 'Ice',
        minPrice: 26,
        avgPrice: 30,
        maxPrice: 35,
        volume: 8,
    },
    [MinableWares.methane]: {
        name: 'Methane',
        minPrice: 41,
        avgPrice: 48,
        maxPrice: 55,
        volume: 6,
    },
    [HighTechWares.microchips]: {
        name: 'Microchips',
        minPrice: 805,
        avgPrice: 948,
        maxPrice: 1090,
        volume: 22,
    },
    [ShipTechWares.missilecomponents]: {
        name: 'Missile Components',
        minPrice: 6,
        avgPrice: 9,
        maxPrice: 13,
        volume: 2,
    },
    [MinableWares.ore]: {
        name: 'Ore',
        minPrice: 43,
        avgPrice: 50,
        maxPrice: 58,
        volume: 10,
    },
    [HighTechWares.plasmaconductors]: {
        name: 'Plasma Conductors',
        minPrice: 769,
        avgPrice: 1026,
        maxPrice: 1282,
        volume: 32,
    },
    [HighTechWares.quantumtubes]: {
        name: 'Quantum Tubes',
        minPrice: 225,
        avgPrice: 300,
        maxPrice: 375,
        volume: 22,
    },
    [RefinedWares.refinedmetals]: {
        name: 'Refined Metals',
        minPrice: 89,
        avgPrice: 148,
        maxPrice: 207,
        volume: 14,
    },
    [HighTechWares.scanningarrays]: {
        name: 'Scanning Arrays',
        minPrice: 842,
        avgPrice: 1053,
        maxPrice: 1264,
        volume: 38,
    },
    [ShipTechWares.shieldcomponents]: {
        name: 'Shield Components',
        minPrice: 113,
        avgPrice: 188,
        maxPrice: 264,
        volume: 10,
    },
    [MinableWares.silicon]: {
        name: 'Silicon',
        minPrice: 111,
        avgPrice: 130,
        maxPrice: 150,
        volume: 10,
    },
    [RefinedWares.siliconwafers]: {
        name: 'Silicon Wafers',
        minPrice: 180,
        avgPrice: 229,
        maxPrice: 419,
        volume: 18,
    },
    [ShipTechWares.smartchips]: {
        name: 'Smart Chips',
        minPrice: 46,
        avgPrice: 57,
        maxPrice: 69,
        volume: 2,
    },
    [RefinedWares.superfluidcoolant]: {
        name: 'Superfluid Coolant',
        minPrice: 90,
        avgPrice: 150,
        maxPrice: 211,
        volume: 16,
    },
    [ShipTechWares.turrentcomponents]: {
        name: 'Turret Components',
        minPrice: 164,
        avgPrice: 273,
        maxPrice: 383,
        volume: 20,
    },
    [ShipTechWares.weaponcomponents]: {
        name: 'Weapon Components',
        minPrice: 171,
        avgPrice: 285,
        maxPrice: 399,
        volume: 20,
    }
} as const satisfies Record<WaresType, WaresData>;

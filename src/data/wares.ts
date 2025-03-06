export enum Wares {
    energycells = 'energycells',
    ore = 'ore',
    silicon = 'silicon',
    ice = 'ice',
    helium = 'helium',
    hydrogen = 'hydrogen',
    methane = 'methane',
    water = 'water',
    antimattercells = 'antimattercells',
    graphene = 'graphene',
    refinedmetals = 'refinedmetals',
    siliconwafers = 'siliconwafers',
    superfluidcoolant = 'superfluidcoolant',
    advancedelectronics = 'advancedelectronics',
    antimatterconverters = 'antimatterconverters',
    claytronics = 'claytronics',
    dronecomponents = 'dronecomponents',
    fieldcoils = 'fieldcoils',
    missilecomponents = 'missilecomponents',
    shieldcomponents = 'shieldcomponents',
    smartchips = 'smartchips',
    turrentcomponents = 'turrentcomponents',
    weaponcomponents = 'weaponcomponents',
    advancedcomposites = 'advancedcomposites',
    engineparts = 'engineparts',
    hullparts = 'hullparts',
    microchips = 'microchips',
    plasmaconductors = 'plasmaconductors',
    quantumtubes = 'quantumtubes',
    scanningarrays = 'scanningarrays',
}

export type WaresData = {
    name: string;
    type: WaresType;
    minPrice: number;
    avgPrice: number;
    maxPrice: number;
    volume: number;
}

export enum WaresType {
    energy = 'energy',
    gases = 'gases',
    minerals = 'minerals',
    food = 'food',
    agricultural = 'agricultural',
    pharmaceuticals = 'pharmaceuticals',
    refined = 'refined',
    hightech = 'hightech',
    shiptech = 'shiptech',
}

export const WaresData = {
    [Wares.advancedcomposites]: {
        name: 'Advanced Composites',
        type: WaresType.hightech,
        minPrice: 432,
        avgPrice: 540,
        maxPrice: 648,
        volume: 32,
    },
    [Wares.advancedelectronics]: {
        name: 'Advanced Electronics',
        type: WaresType.shiptech,
        minPrice: 710,
        avgPrice: 1014,
        maxPrice: 1318,
        volume: 30,
    },
    [Wares.antimattercells]: {
        name: 'Antimatter Cells',
        type: WaresType.refined,
        minPrice: 121,
        avgPrice: 202,
        maxPrice: 283,
        volume: 18,
    },
    [Wares.antimatterconverters]: {
        name: 'Antimatter Converters',
        type: WaresType.shiptech,
        minPrice: 248,
        avgPrice: 354,
        maxPrice: 461,
        volume: 10,
    },
    [Wares.claytronics]: {
        name: 'Claytronics',
        type: WaresType.shiptech,
        minPrice: 1734,
        avgPrice: 2040,
        maxPrice: 2346,
        volume: 24,
    },
    [Wares.dronecomponents]: {
        name: 'Drone Components',
        type: WaresType.shiptech,
        minPrice: 685,
        avgPrice: 914,
        maxPrice: 1142,
        volume: 30,
    },
    [Wares.energycells]: {
        name: 'Energy Cells',
        type: WaresType.energy,
        minPrice: 10,
        avgPrice: 16,
        maxPrice: 22,
        volume: 1,
    },
    [Wares.engineparts]: {
        name: 'Engine Parts',
        type: WaresType.hightech,
        minPrice: 128,
        avgPrice: 182,
        maxPrice: 237,
        volume: 15,
    },
    [Wares.fieldcoils]: {
        name: 'Field Coils',
        type: WaresType.shiptech,
        minPrice: 247,
        avgPrice: 412,
        maxPrice: 576,
        volume: 15,
    },
    [Wares.graphene]: {
        name: 'Graphene',
        type: WaresType.refined,
        minPrice: 100,
        avgPrice: 166,
        maxPrice: 233,
        volume: 20,
    },
    [Wares.helium]: {
        name: 'Helium',
        type: WaresType.gases,
        minPrice: 37,
        avgPrice: 44,
        maxPrice: 51,
        volume: 6,
    },
    [Wares.hullparts]: {
        name: 'Hull Parts',
        type: WaresType.hightech,
        minPrice: 146,
        avgPrice: 209,
        maxPrice: 272,
        volume: 12,
    },
    [Wares.hydrogen]: {
        name: 'Hydrogen',
        type: WaresType.gases,
        minPrice: 49,
        avgPrice: 58,
        maxPrice: 67,
        volume: 6,
    },
    [Wares.ice]: {
        name: 'Ice',
        type: WaresType.minerals,
        minPrice: 26,
        avgPrice: 30,
        maxPrice: 35,
        volume: 8,
    },
    [Wares.methane]: {
        name: 'Methane',
        type: WaresType.gases,
        minPrice: 41,
        avgPrice: 48,
        maxPrice: 55,
        volume: 6,
    },
    [Wares.microchips]: {
        name: 'Microchips',
        type: WaresType.hightech,
        minPrice: 805,
        avgPrice: 948,
        maxPrice: 1090,
        volume: 22,
    },
    [Wares.missilecomponents]: {
        name: 'Missile Components',
        type: WaresType.shiptech,
        minPrice: 6,
        avgPrice: 9,
        maxPrice: 13,
        volume: 2,
    },
    [Wares.ore]: {
        name: 'Ore',
        type: WaresType.minerals,
        minPrice: 43,
        avgPrice: 50,
        maxPrice: 58,
        volume: 10,
    },
    [Wares.plasmaconductors]: {
        name: 'Plasma Conductors',
        type: WaresType.hightech,
        minPrice: 769,
        avgPrice: 1026,
        maxPrice: 1282,
        volume: 32,
    },
    [Wares.quantumtubes]: {
        name: 'Quantum Tubes',
        type: WaresType.hightech,
        minPrice: 225,
        avgPrice: 300,
        maxPrice: 375,
        volume: 22,
    },
    [Wares.refinedmetals]: {
        name: 'Refined Metals',
        type: WaresType.refined,
        minPrice: 89,
        avgPrice: 148,
        maxPrice: 207,
        volume: 14,
    },
    [Wares.scanningarrays]: {
        name: 'Scanning Arrays',
        type: WaresType.hightech,
        minPrice: 842,
        avgPrice: 1053,
        maxPrice: 1264,
        volume: 38,
    },
    [Wares.shieldcomponents]: {
        name: 'Shield Components',
        type: WaresType.shiptech,
        minPrice: 113,
        avgPrice: 188,
        maxPrice: 264,
        volume: 10,
    },
    [Wares.silicon]: {
        name: 'Silicon',
        type: WaresType.minerals,
        minPrice: 111,
        avgPrice: 130,
        maxPrice: 150,
        volume: 10,
    },
    [Wares.siliconwafers]: {
        name: 'Silicon Wafers',
        type: WaresType.refined,
        minPrice: 180,
        avgPrice: 299,
        maxPrice: 419,
        volume: 18,
    },
    [Wares.smartchips]: {
        name: 'Smart Chips',
        type: WaresType.shiptech,
        minPrice: 46,
        avgPrice: 57,
        maxPrice: 69,
        volume: 2,
    },
    [Wares.superfluidcoolant]: {
        name: 'Superfluid Coolant',
        type: WaresType.refined,
        minPrice: 90,
        avgPrice: 150,
        maxPrice: 211,
        volume: 16,
    },
    [Wares.turrentcomponents]: {
        name: 'Turret Components',
        type: WaresType.shiptech,
        minPrice: 164,
        avgPrice: 273,
        maxPrice: 383,
        volume: 20,
    },
    [Wares.water]: {
        name: 'Water',
        type: WaresType.agricultural,
        minPrice: 32,
        avgPrice: 53,
        maxPrice: 74,
        volume: 6,
    },
    [Wares.weaponcomponents]: {
        name: 'Weapon Components',
        type: WaresType.shiptech,
        minPrice: 171,
        avgPrice: 285,
        maxPrice: 399,
        volume: 20,
    }
} as const satisfies Record<Wares, WaresData>;

export const RefinedGoods = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.refined);
export const Gases = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.gases);
export const Minerals = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.minerals);
export const Agricultural = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.agricultural);
export const Hightech = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.hightech);
export const Shiptech = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.shiptech);
export const Energy = Object.values(Wares).filter(ware => WaresData[ware].type === WaresType.energy);
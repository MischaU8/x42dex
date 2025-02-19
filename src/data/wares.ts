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
    missiles = 'missiles',
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
    superconductormaterials = 'superconductormaterials',
    titaniumalloys = 'titaniumalloys'
}

export type WaresType = EnergyWares | MinableWares | RefinedWares | ShipTechWares | HighTechWares

export const Wares = {
    [EnergyWares.energycells]: {
        name: 'Energy Cells',
        volume: 1,
        minPrice: 10,
        avgPrice: 16,
        maxPrice: 22,
    },
    [MinableWares.ore]: {
        name: 'Ore',
        volume: 10,
        minPrice: 43,
        avgPrice: 50,
        maxPrice: 58,
    },
    [MinableWares.silicon]: {
        name: 'Silicon',
        volume: 10,
        minPrice: 111,
        avgPrice: 130,
        maxPrice: 150,
    },
    [MinableWares.ice]: {
        name: 'Ice',
        volume: 8,
        minPrice: 26,
        avgPrice: 30,
        maxPrice: 35,
    },
    [MinableWares.helium]: {
        name: 'Helium',
        volume: 6,
        minPrice: 37,
        avgPrice: 44,
        maxPrice: 51,
    },
    [MinableWares.hydrogen]: {
        name: 'Hydrogen',
        volume: 6,
        minPrice: 49,
        avgPrice: 58,
        maxPrice: 67,
    },
    [MinableWares.methane]: {
        name: 'Methane',
        volume: 6,
        minPrice: 41,
        avgPrice: 48,
        maxPrice: 55,
    },
} as const;

export type WaresKey = keyof typeof Wares;
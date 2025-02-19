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

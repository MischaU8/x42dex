// config.ts

const worldSize = 3;

export const Config = {

    Seed: 41,

    WorldSize: worldSize,
    MapCols: Math.floor(60),
    MapRows: Math.floor(41),
    MapSize: 48,
    MapPadding: 1,

    FogOfWar: true,
    Background: true,
    DrawSensors: false,

    FontSize: 20,
    InitialZoom: 1,
    ZoomWheelFactor: 1.05,
    MinZoom: 0.35,
    MaxZoom: 2.0,
    MinShipVisibilityZoom: 0.35,

    NumAstroids: Math.floor(25 * worldSize * worldSize),

    AstroidWidth: 32,
    AstroidHeight: 32,
    StationWidth: 64,
    StationHeight: 64,
    ShipWidth: 16,
    ShipHeight: 16,

    MaxRangeMultiplier: 64,

    // station
    MinStationDistance: 64 * worldSize,
    MinStationDistanceSameType: 256 * worldSize,
    MaxHoursOfStock: 1,

    // autopilot
    AutoPilotLeadTime: 0.5,
    AutoPilotMinLeadTime: 0.1,
    AutoPilotStoppingDistance: 16,
    AutoPilotAlignmentVelocityFactor: 0.05,

    AngularVelocityDecay: 0.95,
    AccelerationDecay: 0.9,
    VelocityDecay: 0.99,

} as const;

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
    Background: false,
    DrawSensors: false,

    FontSize: 20,
    InitialZoom: 1,
    ZoomWheelFactor: 1.05,
    MinZoom: 0.35,
    MaxZoom: 2.0,
    MinShipVisibilityZoom: 0.5,

    NumAstroids: Math.floor(25 * worldSize * worldSize),

    StaticSpaceObjectWidth: 32,
    StaticSpaceObjectHeight: 32,
    ShipWidth: 16,
    ShipHeight: 16,

    MaxRangeMultiplier: 32,

    // station
    MinStationDistance: 64 * worldSize,
    MinStationDistanceSameType: 256 * worldSize,

    // autopilot
    AutoPilotLeadTime: 0.5,
    AutoPilotMinLeadTime: 0.1,
    AutoPilotStoppingDistance: 16,
    AutoPilotAlignmentVelocityFactor: 0.05,

    AngularVelocityDecay: 0.95,
    AccelerationDecay: 0.9,
    VelocityDecay: 0.99,

} as const;

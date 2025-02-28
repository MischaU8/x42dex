// config.ts

const worldSize = 3;

export const Config = {

    Seed: 41,

    WorldSize: worldSize,
    MapCols: Math.floor(20 * worldSize),
    MapRows: Math.floor(11 * worldSize),
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

    NumStations: Math.floor(5 * worldSize * worldSize),
    NumAstroids: Math.floor(25 * worldSize * worldSize),
    NumShips: Math.floor(15 * worldSize * worldSize),

    StaticSpaceObjectWidth: 32,
    StaticSpaceObjectHeight: 32,
    ShipWidth: 16,
    ShipHeight: 16,

    PlayerMaxVelocity: 321,
    PlayerMaxAcceleration: 169,
    PlayerMaxDeceleration: 169,
    PlayerMaxAngularVelocity: 1.17, // 67 degrees per second

    // station
    StationMaxVolume: 100_000,
    StationMinInitialBalance: 100_000,
    StationMaxInitialBalance: 1_000_000,

    // autopilot
    PlayerLeadTime: 0.5,
    PlayerMinLeadTime: 0.1,
    AutoPilotStoppingDistance: 16,
    AutoPilotAlignmentVelocityFactor: 0.05,

    AngularVelocityDecay: 0.95,
    AccelerationDecay: 0.9,
    VelocityDecay: 0.99,

} as const;

// config.ts

export const Config = {

    Seed: 42,

    MapCols: 20,
    MapRows: 11,
    MapSize: 48,
    MapPadding: 1,

    FontSize: 20,
    InitialZoom: 1,
    ZoomWheelFactor: 1.05,

    NumStations: 5,
    NumAstroids: 25,
    NumShips: 15,

    StaticSpaceObjectWidth: 32,
    StaticSpaceObjectHeight: 32,
    ShipWidth: 16,
    ShipHeight: 16,

    PlayerMaxVelocity: 321,
    PlayerMaxAcceleration: 169,
    PlayerMaxDeceleration: 169,
    PlayerMaxAngularVelocity: 1.17, // 67 degrees per second

    MaxCargo: 100,

    // autopilot
    PlayerLeadTime: 0.5,
    PlayerMinLeadTime: 0.1,
    AutoPilotStoppingDistance: 16,
    AutoPilotAlignmentVelocityFactor: 0.05,

    AngularVelocityDecay: 0.95,
    AccelerationDecay: 0.9,
    VelocityDecay: 0.99,

} as const;

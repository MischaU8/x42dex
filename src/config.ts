// config.ts

export const Config = {
    PlayerMaxVelocity: 321,
    PlayerMaxAcceleration: 169,
    PlayerMaxDeceleration: 169,
    PlayerMaxAngularVelocity: 1.17, // 67 degrees per second
    PlayerLeadTime: 0.5,
    PlayerMinLeadTime: 0.1,
    AngularVelocityDecay: 0.95,
    AccelerationDecay: 0.9,
    VelocityDecay: 0.99,
    ParallaxSpeed100: 1,
    ParallaxSpeed80: 2,
    ParallaxSpeed60: 3,
} as const;

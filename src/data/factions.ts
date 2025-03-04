import * as ex from 'excalibur';

export enum Faction {
    player = 'player',
    pirate = 'pirate',
    argon = 'argon',
    teladi = 'teladi',
    paranid = 'paranid',
    neutral = 'neutral',
}

export const Factions = {
    [Faction.player]: {
        name: 'Player',
        color: ex.Color.Chartreuse,
    },
    [Faction.pirate]: {
        name: 'Pirate',
        color: ex.Color.Vermilion,
    },
    [Faction.argon]: {
        name: 'Argon',
        color: ex.Color.Azure,
    },
    [Faction.teladi]: {
        name: 'Teladi',
        color: ex.Color.Yellow,
    },
    [Faction.paranid]: {
        name: 'Paranid',
        color: ex.Color.Violet,
    },
    [Faction.neutral]: {
        name: 'Neutral',
        color: ex.Color.DarkGray,
    },
} as const;

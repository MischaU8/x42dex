import * as ex from "excalibur";

export type MyActorEvents = {
  selected: ActorSelectedEvent;
  targeted: ActorTargetedEvent;
}

export class ActorSelectedEvent extends ex.GameEvent<ex.Actor> {
  constructor(public target: ex.Actor) {
    super();
  }
}

export class ActorTargetedEvent extends ex.GameEvent<ex.Actor> {
  constructor(public target: ex.Actor) {
    super();
  }
}

export const MyActorEvents = {
  Selected: 'selected',
  Targeted: 'targeted',
} as const;

import * as ex from "excalibur";
import { Ship } from "./ship";

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

/* ShipEvents */

export type ShipEvents = {
  status: ShipStatusEvent;
  stopped: ShipStoppedEvent;
}

export class ShipStatusEvent extends ex.GameEvent<Ship> {
  constructor(public target: Ship, public status: string) {
    super();
  }
}
export class ShipStoppedEvent extends ex.GameEvent<Ship> {
  constructor(public target: Ship) {
    super();
  }
}

export const ShipEvents = {
  Status: 'status',
  Stopped: 'stopped'
} as const;

import { Component } from "excalibur";

export class MovementComponent extends Component {
    constructor(
        public readonly maxVelocity: number,
        public readonly maxAcceleration: number,
        public readonly maxDeceleration: number,
        public readonly maxAngularVelocity: number
    ) {
        super();
    }
}
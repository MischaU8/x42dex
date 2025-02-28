import * as ex from 'excalibur';
import { Config } from '../config';
import { Ship } from '../actors/ship';
import { MovementComponent } from './movement';
export type ShipTarget = ex.Vector | ex.Actor;


export class AutopilotComponent extends ex.Component {
    declare owner: Ship;

    enabled: boolean = false;
    target: ex.Vector | ex.Actor = ex.Vector.Zero;
    movement!: MovementComponent;

    onAdd(owner: ex.Actor): void {
        owner.on('initialize', (evt: ex.InitializeEvent) => {
            this.movement = owner.get(MovementComponent) as MovementComponent;
        })
        owner.on('postupdate', this.update.bind(this));
    }

    update() {
        if (this.getTargetPos().equals(ex.Vector.Zero) || !this.enabled || this.owner.motionSystem.paused) {
            return;
        }

        const delta = this.getTargetPos().sub(this.owner.pos);
        const distanceToTarget = delta.magnitude;
        const currentSpeed = this.owner.vel.magnitude;

        const leadTime = currentSpeed > 0 ?
            (distanceToTarget / currentSpeed) * Config.AutoPilotLeadTime :
            Config.AutoPilotMinLeadTime;

        const leadPos = this.owner.pos.add(this.owner.vel.scale(leadTime));
        const leadDelta = this.getTargetPos().sub(leadPos);

        // Calculate desired angle change
        const targetAngle = leadDelta.angleBetween(this.owner.rotation + Math.PI / 2, ex.RotationType.ShortestPath);
        // Gradually adjust angular velocity towards target
        if (Math.abs(targetAngle) > 0.001) {
            const direction = Math.sign(targetAngle);
            if (direction > 0) {
                this.owner.rotateRight();
            } else {
                this.owner.rotateLeft();
            }
        }

        // Calculate how aligned we are with the target (-1 to 1, where 1 is perfectly aligned)
        const alignment = Math.cos(leadDelta.angleBetween(this.owner.rotation - Math.PI / 2, ex.RotationType.ShortestPath));

        const breakingDistance = this.calcBreakingDistance(currentSpeed, this.movement.maxDeceleration);
        const coastingDistance = this.calcBreakingDistance(currentSpeed, this.movement.maxAcceleration);

        var maxVelocity = this.calcMaxVelocity(distanceToTarget, alignment);

        if (distanceToTarget < Config.AutoPilotStoppingDistance && !(this.target instanceof Ship)) {
            // console.log('stopping')
            this.owner.orderStop(false, this.target);
        } else if (distanceToTarget < breakingDistance || currentSpeed > maxVelocity) {
            // console.log('breaking')
            this.owner.moveBackward()
        } else if (distanceToTarget > coastingDistance && currentSpeed < maxVelocity) {
            // console.log('accelerating')
            this.owner.moveForward();
        } else {
            // console.log('coasting')
        }
    }

    setTarget(target: ShipTarget) {
        this.target = target;
        this.enabled = true;
    }

    disable() {
        this.target = ex.Vector.Zero;
        this.enabled = false;
    }

    public getTargetPos(): ex.Vector {
        if (this.target instanceof ex.Vector) {
            return this.target;
        } else {
            return this.target.pos;
        }
    }

    public getTargetDetails(): string {
        if (this.target instanceof ex.Vector && this.target.equals(ex.Vector.Zero)) {
            return '---';
        } else if (this.target instanceof ex.Vector) {
            return `[${this.target.x.toFixed(0)},${this.target.y.toFixed(0)}]`;
        } else {
            return `[${this.target.name}] ${this.target.pos.distance(this.owner.pos).toFixed(0)}m`;
        }
    }


    private calcBreakingDistance(vel: number, acc: number) {
        return (vel * vel) / (2 * acc);
    }

    private calcMaxVelocity(distanceToTarget: number, alignment: number) {
        if (distanceToTarget < Config.AutoPilotStoppingDistance) {
            return 0;
        } else if (alignment < 0) {
            return this.movement.maxVelocity * Config.AutoPilotAlignmentVelocityFactor;
        } else {
            return this.movement.maxVelocity * alignment;
        }
    }
}

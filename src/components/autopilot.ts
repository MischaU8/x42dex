import * as ex from 'excalibur';
import { PausableMotionSystem } from '../systems/PausableMotionSystem';
import { Config } from '../config';
import { Ship } from '../actors/ship';

export type ShipTarget = ex.Vector | ex.Actor;


export class AutopilotComponent extends ex.Component {
    declare owner: Ship;

    enabled: boolean = false;
    target: ex.Vector | ex.Actor = ex.Vector.Zero;
    motionSystem!: PausableMotionSystem;

    constructor(owner: Ship) {
        super();
        this.owner = owner;
    }

    onAdd(owner: ex.Actor): void {
        owner.on('initialize', (evt: ex.InitializeEvent) => {
            this.motionSystem = evt.engine.currentScene.world.get(PausableMotionSystem) as PausableMotionSystem;
        })
        owner.on('postupdate', this.update.bind(this));
    }

    update() {
        if (this.getTargetPos().equals(ex.Vector.Zero) || !this.enabled || this.motionSystem.paused) {
            return;
        }

        const delta = this.getTargetPos().sub(this.owner.pos);
        const distanceToTarget = delta.magnitude;
        const currentSpeed = this.owner.vel.magnitude;

        const leadTime = currentSpeed > 0 ?
            (distanceToTarget / currentSpeed) * Config.PlayerLeadTime :
            Config.PlayerMinLeadTime;

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

        const breakingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxDeceleration);
        const coastingDistance = this.calcBreakingDistance(currentSpeed, Config.PlayerMaxAcceleration);

        var maxVelocity = this.calcMaxVelocity(distanceToTarget, alignment);

        if (distanceToTarget < Config.AutoPilotStoppingDistance && !(this.target instanceof Ship)) {
            // console.log('stopping')
            this.owner.orderStop();
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
            return `[${this.target.name}]`;
        }
    }


    private calcBreakingDistance(vel: number, acc: number) {
        return (vel * vel) / (2 * acc);
    }

    private calcMaxVelocity(distanceToTarget: number, alignment: number) {
        if (distanceToTarget < Config.AutoPilotStoppingDistance) {
            return 0;
        } else if (alignment < 0) {
            return Config.PlayerMaxVelocity * Config.AutoPilotAlignmentVelocityFactor;
        } else {
            return Config.PlayerMaxVelocity * alignment;
        }
    }
}

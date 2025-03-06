import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { Wares} from '../data/wares';
import { ProductionJob, ProductionJobs } from '../data/productionjobs';
import { StaticSpaceObject } from '../actors/StaticSpaceObject';
import { MyLevel } from '../scenes/level';


type ProductionJobData = {
    jobType: ProductionJob;
    running: boolean;
    timeRemaining: number;
}

export class ProductionComponent extends ex.Component {
    declare owner: StaticSpaceObject;
    productionJobs: ProductionJobData[]

    private level: MyLevel;

    constructor(level: MyLevel, config: { [key in Wares]?: number }) {
        super();
        this.productionJobs = [] as ProductionJobData[];
        this.level = level;

        for (const [jobType, size] of Object.entries(config)) {
            if (!ProductionJobs[jobType as Wares]) {
                throw new Error(`Production job ${jobType} not found`);
            }
            for (let i = 0; i < size; i++) {
                this.productionJobs.push({
                    jobType: ProductionJobs[jobType as Wares]!,
                    running: false,
                    timeRemaining: 0,
                })
            }
        }
    }

    onAdd(owner: ex.Actor): void {
        const timer = new ex.Timer({
            action: () => {
                if (this.owner.motionSystem.paused) {
                    return;
                }
                // console.log('PING', this.owner.name, timer.interval);
                this.updateProductionJobs(timer.interval);
            },
            repeats: true,
            interval: 1000,
            random: this.level.random,
            randomRange: [-100, 100],
        })
        this.level.engine.currentScene.add(timer)
        timer.start();
    }

    getDetail(): string {
        return this.productionJobs.map(job => `${job.jobType.output.padStart(16, " ")} ${job.running ? `${Math.floor(job.timeRemaining)}/${job.jobType.cycleTime}s` : 'idle'}`).join('\n');
    }

    private updateProductionJobs(delta: number) {
        for (const job of this.productionJobs) {
            if (job.running) {
                job.timeRemaining -= delta / 1000;
                if (job.timeRemaining <= 0) {
                    this.finishJob(job);
                }
            } else {
                // check if we can start a new job
                this.maybeStartJob(job);
            }
        }
    }

    private maybeStartJob(job: ProductionJobData) {
        const cargo = this.owner.get(CargoComponent);
        // do we have all the inputs?
        for (const [input, amount] of Object.entries(job.jobType.input)) {
            if ((cargo.items[input as Wares] || 0) < amount) {
                return;
            }
        }
        // remove the inputs
        for (const [input, amount] of Object.entries(job.jobType.input)) {
            cargo.removeItem(input as Wares, amount);
        }
        job.running = true;
        job.timeRemaining = job.jobType.cycleTime;
        // console.log('PRODUCTIONSTART', this.owner.name, job.jobType.output, job.jobType.cycleTime);
    }

    private finishJob(job: ProductionJobData) {
        job.running = false;
        job.timeRemaining = 0;
        const cargo = this.owner.get(CargoComponent);
        const transferAmount = Math.min(cargo.getAvailableSpaceFor(job.jobType.output), job.jobType.batchSize);
        if (transferAmount < job.jobType.batchSize) {
            console.log('PRODUCTION', this.owner.name, job.jobType.output, transferAmount, 'not enough space for full batch');
        }
        cargo.addItem(job.jobType.output, transferAmount);
        // console.log('PRODUCTION FINISH', this.owner.name, job.jobType.output, transferAmount);
    }

}
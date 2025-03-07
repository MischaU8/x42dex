import * as ex from 'excalibur';
import { CargoComponent } from './cargo';
import { Wares} from '../data/wares';
import { ProductionJob, ProductionJobs } from '../data/productionjobs';
import { StaticSpaceObject } from '../actors/StaticSpaceObject';
import { MyLevel } from '../scenes/level';
import { ProductionConfig } from '../data/stations';
import { Config } from '../config';


type ProductionJobData = {
    jobType: ProductionJob;
    running: boolean;
    timeRemaining: number;
}

export class ProductionComponent extends ex.Component {
    declare owner: StaticSpaceObject;
    productionJobs: ProductionJobData[]
    hourlyResources: { [key in Wares]: number };

    private level: MyLevel;
    private config: ProductionConfig;

    constructor(level: MyLevel, config: ProductionConfig) {
        super();
        this.productionJobs = [] as ProductionJobData[];
        this.hourlyResources = {} as { [key in Wares]: number };
        this.level = level;
        this.config = config;
    }

    initJobs() {
        for (const [jobType, size] of Object.entries(this.config.jobs)) {
            if (!ProductionJobs[jobType as Wares]) {
                throw new Error(`Production job ${jobType} not found`);
            }
            const job = ProductionJobs[jobType as Wares]!;
            for (let i = 0; i < size; i++) {
                this.productionJobs.push({
                    jobType: job,
                    running: false,
                    timeRemaining: 0,
                })
            }
            const cargo = this.owner.get(CargoComponent);
            ex.assert(`Production job output ${job.output} not in resource filter: ${cargo.resourceFilter.join(', ')}`, () => cargo.resourceFilter.includes(job.output));
            const cyclesPerHour = 3600 / job.cycleTime;
            const production = size * job.batchSize * cyclesPerHour;
            this.hourlyResources[job.output] = (this.hourlyResources[job.output] || 0) + production;
            for (const [input, amount] of Object.entries(job.input)) {
                ex.assert(`Production job input  ${input} not in resource filter: ${cargo.resourceFilter.join(', ')}`, () => cargo.resourceFilter.includes(input as Wares));
                const consumption = size * amount * cyclesPerHour;
                this.hourlyResources[input as Wares] = (this.hourlyResources[input as Wares] || 0) - consumption;
            }
        }
        if (this.config.startJobs) {
            for (const job of this.productionJobs) {
                job.running = true;
                job.timeRemaining = this.level.random.integer(job.jobType.cycleTime * 0.1, job.jobType.cycleTime * 0.9);
            }
        }
        if (this.config.startCargo) {
            const cargo = this.owner.get(CargoComponent);
            for (const [resource, amount] of Object.entries(this.hourlyResources)) {
                const stock = this.level.random.integer(0, Math.abs(amount) * Config.MaxHoursOfStock);
                cargo.addItem(resource as Wares, stock);
            }
        }
    }

    onAdd(owner: ex.Actor): void {
        this.initJobs();
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
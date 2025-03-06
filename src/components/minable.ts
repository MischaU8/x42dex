import * as ex from 'excalibur'
import { Wares } from '../data/wares'
import { StaticSpaceObject } from '../actors/StaticSpaceObject'
export class MinableComponent extends ex.Component {
  declare owner: StaticSpaceObject

  type: Wares
  amount: number
  maxAmount: number
  respawnRate: number

  constructor(type: Wares, amount: number, maxAmount: number, respawnRate: number) {
    super()
    this.type = type
    this.amount = amount
    this.maxAmount = maxAmount
    this.respawnRate = respawnRate
  }

  onAdd(owner: ex.Actor): void {
    owner.on('postupdate', (evt: ex.PostUpdateEvent) => {
      this.onPostUpdate(evt.engine, evt.elapsed)
    })
  }

  onPostUpdate(_engine: ex.Engine, elapsed: number): void {
    if (this.owner.motionSystem.paused) {
      return;
    }
    if (this.amount < this.maxAmount) {
      this.amount += this.respawnRate * (elapsed / 1000)
    }
    this.amount = ex.clamp(this.amount, 0, this.maxAmount)
  }

  getDetails(): string {
    return `[${this.owner.name}]\n${this.type} ${this.amount.toFixed(1)} / ${this.maxAmount}\nrespawn ${this.respawnRate.toFixed(2)}/s`
  }
}

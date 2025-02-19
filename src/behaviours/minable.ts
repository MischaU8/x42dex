import * as ex from 'excalibur'


export type WaresType = 'ore' | 'station'


export class MinableComponent extends ex.Component {
  declare owner: ex.Actor

  type: WaresType
  amount: number
  respawnRate: number
  maxAmount: number

  constructor(type: WaresType, amount: number, respawnRate: number, maxAmount: number) {
    super()
    this.type = type
    this.amount = amount
    this.respawnRate = respawnRate
    this.maxAmount = maxAmount
  }

  onAdd(owner: ex.Actor): void {
    owner.on('postupdate', (evt: ex.PostUpdateEvent) => {
      this.onPostUpdate(evt.engine, evt.elapsed)
    })
  }

  onPostUpdate(engine: ex.Engine, elapsed: number): void {
    if (this.amount < this.maxAmount) {
      this.amount += this.respawnRate * elapsed
    }
  }
}

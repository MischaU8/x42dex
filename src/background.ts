import * as ex from "excalibur";
import { Player } from "./player";

export class Background extends ex.Actor {
    randomOffset: ex.Vector;
    backgroundSprite: ex.Sprite;
    speed: number;
    player: Player;
    
    constructor(random: ex.Random, sprite: ex.Sprite, speed: number, player: Player) {
        super({
            pos: ex.vec(0, 0),
            anchor: ex.vec(0, 0),
            height: 64,
            width: 64,
            z: -20
        })
        this.backgroundSprite = sprite;
        this.randomOffset = ex.vec(random.integer(0, this.backgroundSprite.width), random.integer(0, this.backgroundSprite.height));
        this.speed = speed;
        this.player = player;
    }
    onInitialize(engine: ex.Engine): void {
        this.backgroundSprite.sourceView.x = this.randomOffset.x;
        this.backgroundSprite.sourceView.y = this.randomOffset.y;
        this.backgroundSprite.sourceView.width = engine.screen.drawWidth;
        this.backgroundSprite.sourceView.height = engine.screen.drawHeight;
        
        this.backgroundSprite.destSize.width = engine.screen.drawWidth;
        this.backgroundSprite.destSize.height = engine.screen.drawHeight;

        this.graphics.use(this.backgroundSprite);
    }
    onPostUpdate(_engine: ex.Engine, elapsedMs: number): void {
        this.backgroundSprite.sourceView.x += this.player.vel.x * this.speed * (elapsedMs / 1000);
        this.backgroundSprite.sourceView.y += this.player.vel.y * this.speed * (elapsedMs / 1000);
        this.backgroundSprite.sourceView.x = this.backgroundSprite.sourceView.x % this.backgroundSprite.width;
        this.backgroundSprite.sourceView.y = this.backgroundSprite.sourceView.y % this.backgroundSprite.height;
    }
}
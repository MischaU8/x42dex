import * as ex from "excalibur";

export class Background extends ex.Actor {
    randomOffset: ex.Vector;
    backgroundSprite: ex.Sprite;
    factor: number;

    oldCameraPos!: ex.Vector;
    oldCameraZoom!: number;
    oldCameraViewport!: ex.BoundingBox;
    
    constructor(random: ex.Random, sprite: ex.Sprite, factor: number) {
        super({
            pos: ex.vec(0, 0),
            anchor: ex.vec(0, 0),
            height: 64,
            width: 64,
            z: -20,
            coordPlane: ex.CoordPlane.Screen,
        })
        this.backgroundSprite = sprite;
        this.randomOffset = ex.vec(random.integer(0, this.backgroundSprite.width), random.integer(0, this.backgroundSprite.height));
        this.factor = factor;
    }

    onInitialize(engine: ex.Engine): void {
        this.backgroundSprite.sourceView.x = this.randomOffset.x;
        this.backgroundSprite.sourceView.y = this.randomOffset.y;
        this.backgroundSprite.sourceView.width = engine.screen.drawWidth;
        this.backgroundSprite.sourceView.height = engine.screen.drawHeight;
        
        this.backgroundSprite.destSize.width = engine.screen.drawWidth;
        this.backgroundSprite.destSize.height = engine.screen.drawHeight;

        this.graphics.use(this.backgroundSprite);

        this.oldCameraPos = engine.currentScene.camera.pos;
        this.oldCameraZoom = engine.currentScene.camera.zoom;
        this.oldCameraViewport = engine.currentScene.camera.viewport;
    }

    onPostUpdate(engine: ex.Engine, elapsedMs: number): void {
        if (this.oldCameraZoom !== engine.currentScene.camera.zoom) {
            const deltaZoom = this.oldCameraZoom / engine.currentScene.camera.zoom;
            this.backgroundSprite.sourceView.width = this.backgroundSprite.sourceView.width * deltaZoom;
            this.backgroundSprite.sourceView.height = this.backgroundSprite.sourceView.height * deltaZoom;

            // compensate for the zoom change
            const deltaViewport = engine.currentScene.camera.viewport.topLeft.sub(this.oldCameraViewport.topLeft).scale(deltaZoom);
            this.backgroundSprite.sourceView.x += deltaViewport.x;
            this.backgroundSprite.sourceView.y += deltaViewport.y;
        }

        if (this.oldCameraPos !== engine.currentScene.camera.pos) {
            let deltaPos = engine.currentScene.camera.pos.sub(this.oldCameraPos);
            this.backgroundSprite.sourceView.x += deltaPos.x * this.factor;
            this.backgroundSprite.sourceView.y += deltaPos.y * this.factor;
        }

        this.backgroundSprite.sourceView.x = this.backgroundSprite.sourceView.x % this.backgroundSprite.width;
        this.backgroundSprite.sourceView.y = this.backgroundSprite.sourceView.y % this.backgroundSprite.height;

        this.oldCameraPos = engine.currentScene.camera.pos;
        this.oldCameraZoom = engine.currentScene.camera.zoom;
        this.oldCameraViewport = engine.currentScene.camera.viewport;
    }
}
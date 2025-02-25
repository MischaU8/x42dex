import * as ex from "excalibur";

export class Cursor extends ex.Actor {

    target: ex.Actor | null = null;

    lineColor: ex.Color = ex.Color.fromHex('#555555');
    rectColor: ex.Color = ex.Color.fromHex('#A5A5A5');
    lineWidth: number = 2;
    rectMargin: number = 3;
    rectScale: number = 1.3;

    constructor(name: string, target: ex.Actor) {
        super({
            name,
            z: 100,
            coordPlane: ex.CoordPlane.Screen,
        });
        this.target = target;

        this.graphics.onPostDraw = (gfx: ex.ExcaliburGraphicsContext) => {
            if (!this.target || this.target.isOffScreen) return;
            gfx.save();
            const pos = this.scene!.engine.screen.worldToScreenCoordinates(this.target.pos)
            const scale = this.scene!.engine.currentScene.camera.zoom * this.rectScale;
            const width = this.target.width * scale;
            const height = this.target.height * scale;
            const margin = this.rectMargin * scale;

            gfx.drawRectangle(ex.vec(pos.x - width / 2, pos.y - height / 2), width, height, ex.Color.Transparent, this.rectColor, this.lineWidth);
            gfx.drawLine(this.roundVec(pos.x, 0), this.roundVec(pos.x, pos.y-height/2 - margin), this.lineColor, this.lineWidth);
            gfx.drawLine(this.roundVec(pos.x, pos.y+height/2 + margin), this.roundVec(pos.x, gfx.height), this.lineColor, this.lineWidth);
            gfx.drawLine(this.roundVec(0, pos.y), this.roundVec(pos.x-width/2 - margin, pos.y), this.lineColor, this.lineWidth);
            gfx.drawLine(this.roundVec(pos.x+width/2 + margin, pos.y), this.roundVec(gfx.width, pos.y), this.lineColor, this.lineWidth);
            gfx.restore();
        }
    }

    roundVec(x: number, y: number): ex.Vector {
        return ex.vec(Math.round(x), Math.round(y))
    }
}

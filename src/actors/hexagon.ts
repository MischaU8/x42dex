import * as ex from "excalibur";

export interface HexagonOptions {
    roundPoints: boolean;
}

export class Hexagon extends ex.Actor {
    polygon: ex.Polygon;

    constructor(name: string, pos: ex.Vector, sideLength: number, options?: ex.RasterOptions & HexagonOptions) {
        const HEXAGON_POINTS = [
            ex.vec(-1, Math.sqrt(3)).scale(sideLength),
            ex.vec(1, Math.sqrt(3)).scale(sideLength),
            ex.vec(2, 0).scale(sideLength),
            ex.vec(1, -1 * Math.sqrt(3)).scale(sideLength),
            ex.vec(-1, -1 * Math.sqrt(3)).scale(sideLength),
            ex.vec(-2, 0).scale(sideLength),
        ];
        if (options?.roundPoints !== false) {
            HEXAGON_POINTS.map(v => v.setTo(Math.round(v.x), Math.round(v.y)));
        }

        super({
            name,
            pos,
            // anchor: ex.vec(0, 0),
        });

        this.polygon = new ex.Polygon({
            ...options,
            points: HEXAGON_POINTS,
        });
        this.graphics.use(this.polygon);
    }
}

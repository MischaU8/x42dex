import * as ex from "excalibur";
import { Hexagon } from "./hexagon";

import { hex_to_pixel, pixel_to_flat_hex } from "./hex_tools";

const MAP_FOG_COLORS = [
    ex.Color.fromHex('#112233'),
    ex.Color.fromHex('#172f46'),
    ex.Color.fromHex('#1e3c59'),
];

export class Map extends ex.Actor {
    random: ex.Random;
    cols: number;
    rows: number;

    selectedHexagon!: Hexagon;
    size: number;
    padding: number;

    hexWidth: number;
    hexHeight: number;

    gridWidth: number;
    gridHeight: number;

    fogTiles: {
        [key: string]: Hexagon;
    } = {};
    visibleTiles: {
        [key: string]: Hexagon;
    } = {};

    constructor(random: ex.Random, cols: number, rows: number, size: number, padding: number) {
        super({
            pos: ex.vec(0, 0),
            color: ex.Color.Black,
            z: -10
        })

        this.random = random;
        this.cols = cols;
        this.rows = rows;
        this.size = size;
        this.padding = padding;

        this.hexWidth = this.size * 3/2;
        this.hexHeight = this.size * Math.sqrt(3);

        this.gridWidth = (cols - 1) * this.hexWidth;
        this.gridHeight = Math.round((rows - 1.5) * this.hexHeight);
    }

    override onInitialize(engine: ex.Engine): void {
        // Calculate offsets to center the grid
        this.offset = ex.vec((engine.drawWidth - this.gridWidth) / 2, (engine.drawHeight - this.gridHeight) / 2);

        // for (let q = 0; q < cols; q++) {
        //     for (let r = 0; r < rows; r++) {
        //         this.spawnTile(q, r);
        //     }
        // }

        this.selectedHexagon = new Hexagon('selected_hex', ex.vec(0, 0), (this.size-this.padding)/2, {
            color: ex.Color.Transparent,
            strokeColor: ex.Color.Yellow,
            lineWidth: 2,
            roundPoints: true,
            padding: 2,
            quality: 2
        });
        this.selectedHexagon.z = 5;
        this.selectedHexagon.graphics.isVisible = false;
        this.addChild(this.selectedHexagon);

        console.log('map initialized', this.cols, this.rows, this.gridWidth, this.gridHeight, this.offset);
    }

    onClick(worldPos: ex.Vector) {
        const [q, r] = pixel_to_flat_hex(worldPos.sub(this.offset), this.size);
        console.log(worldPos, 'HEX', q, r);
        this.selectedHexagon.graphics.isVisible = true;
        this.selectedHexagon.pos = hex_to_pixel(q, r, this.size).add(this.offset);
    }

    spawnTile(q: number, r: number): Hexagon {
        const pos = hex_to_pixel(q, r, this.size).add(this.offset)
        const key = `hex_${q}_${r}`;
        const fogColor = this.random.pickOne(MAP_FOG_COLORS).clone();
        fogColor.a = 0.6;
        const hexagon = new Hexagon(key, pos, (this.size-this.padding)/2, {
            color: fogColor,
            roundPoints: true,
        });
        // hexagon.graphics.isVisible = false;
        this.addChild(hexagon);
        return hexagon;
    }

    getTileQR(pos: ex.Vector): [number, number] {
        return pixel_to_flat_hex(pos.sub(this.offset), this.size);
    }

    visitTile(actor: ex.Actor, [q, r]: [number, number]) {
        const key = `hex_${q}_${r}`;
        const tile = this.visibleTiles[key];
        if (!tile) {
            this.visibleTiles[key] = this.spawnTile(q, r);
        }
    }
}

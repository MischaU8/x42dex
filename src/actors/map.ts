import * as ex from "excalibur";
import { Hexagon } from "./hexagon";
import { Config } from "../config";
import { hex_to_pixel, pixel_to_flat_hex } from "../hex_tools";

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
            z: 0
        })

        this.random = random;
        this.cols = cols;
        this.rows = rows;
        this.size = size;
        this.padding = padding;

        this.hexWidth = this.size * 3/2;
        this.hexHeight = this.size * Math.sqrt(3);

        this.gridWidth = cols * this.hexWidth;
        this.gridHeight = rows * this.hexHeight;
    }

    override onInitialize(engine: ex.Engine): void {
        this.selectedHexagon = new Hexagon('selected_hex', ex.vec(0, 0), (this.size-this.padding)/2, {
            color: ex.Color.Transparent,
            strokeColor: ex.Color.Yellow,
            lineWidth: 2,
            roundPoints: true,
            padding: 2,
            quality: 2
        });
        this.selectedHexagon.graphics.isVisible = false;
        this.addChild(this.selectedHexagon);
    }

    deselectHexagon() {
        this.selectedHexagon.graphics.isVisible = false;
        this.selectedHexagon.pos = ex.Vector.Zero;
    }

    selectHexagon(hexPos: ex.Vector) {
        this.selectedHexagon.graphics.isVisible = true;
        this.selectedHexagon.pos = hexPos;
    }

    onClick(worldPos: ex.Vector) {
        const [q, r] = pixel_to_flat_hex(worldPos, this.size);
        if (!this.isQRInMap(q, r)) {
            return;
        }
        const hexPos = hex_to_pixel(q, r, this.size);
        console.log('map clicked', q, r);
        if (hexPos.equals(this.selectedHexagon.pos)) {
            this.deselectHexagon();
        } else {
            this.selectHexagon(hexPos);
        }
    }

    isPointInMap(worldPos: ex.Vector): boolean {
        const [q, r] = pixel_to_flat_hex(worldPos, this.size);
        return this.isQRInMap(q, r);
    }

    isQRInMap(q: number, r: number): boolean {
        return q >= 0 && q < this.cols && r >= 0 && r < this.rows;
    }

    spawnTile(q: number, r: number): Hexagon {
        const pos = hex_to_pixel(q, r, this.size);
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
        return pixel_to_flat_hex(pos, this.size);
    }

    visitTile(actor: ex.Actor, [q, r]: [number, number]) {
        if (!Config.FogOfWar || !this.isQRInMap(q, r)) {
            return;
        }
        const key = `hex_${q}_${r}`;
        const tile = this.visibleTiles[key];
        if (!tile) {
            this.visibleTiles[key] = this.spawnTile(q, r);
        }
    }
}

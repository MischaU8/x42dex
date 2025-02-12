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
    selectedHexagon!: Hexagon;
    size: number;
    padding: number;
    fogTiles: {
        [key: string]: Hexagon;
    } = {};
    visibleTiles: {
        [key: string]: Hexagon;
    } = {};

    constructor(random: ex.Random, size: number, padding: number) {
        super({
            pos: ex.vec(0, 0),
            color: ex.Color.Black,
            z: -10
        })

        this.random = random;
        this.size = size;
        this.padding = padding;
    }

    override onInitialize(engine: ex.Engine): void {
        // draw a hex grid
        const hexWidth = this.size * 3/2;
        const hexHeight = this.size * Math.sqrt(3);

        const cols = Math.floor(engine.drawWidth / (hexWidth + this.padding));
        const rows = Math.floor(engine.drawHeight / (hexHeight + this.padding));

        // Calculate total grid dimensions
        const gridWidth = (cols - 1) * hexWidth;
        const gridHeight = (rows - 1.5) * hexHeight;
        
        // Calculate offsets to center the grid
        this.offset = ex.vec((engine.drawWidth - gridWidth) / 2, (engine.drawHeight - gridHeight) / 2);

        for (let q = 0; q < cols; q++) {
            for (let r = 0; r < rows; r++) {
                const pos = hex_to_pixel(q, r, this.size).add(this.offset)
                const key = `hex_${q}_${r}`;
                const fogColor = this.random.pickOne(MAP_FOG_COLORS).clone();
                fogColor.a = 0.4;
                const hexagon = new Hexagon(key, pos, (this.size-this.padding)/2, {
                    color: fogColor,
                    roundPoints: true,
                });
                this.addChild(hexagon);
                this.fogTiles[key] = hexagon;
            }
        }

        this.selectedHexagon = new Hexagon('selected_hex', ex.vec(0, 0), (this.size-this.padding)/2, {
            color: ex.Color.Transparent,
            strokeColor: ex.Color.Yellow,
            lineWidth: 2,
            roundPoints: true,
        });
        this.selectedHexagon.graphics.isVisible = false;
        this.addChild(this.selectedHexagon);
    }

    onClick(worldPos: ex.Vector) {
        const [q, r] = pixel_to_flat_hex(worldPos.sub(this.offset), this.size);
        console.log(worldPos, 'HEX', q, r);
        this.selectedHexagon.graphics.isVisible = true;
        this.selectedHexagon.pos = hex_to_pixel(q, r, this.size).add(this.offset);
    }

    visitTile(playerPos: ex.Vector) {
        const [q, r] = pixel_to_flat_hex(playerPos.sub(this.offset), this.size);
        const key = `hex_${q}_${r}`;
        const tile = this.fogTiles[key];
        if (tile) {
            const color = tile.polygon.color.clone();
            color.a = 0.6;
            tile.polygon.color = color;
            // tile.polygon.strokeColor = ex.Color.DarkGray.darken(0.5);
            // tile.polygon.lineWidth = 1;
            delete this.fogTiles[key];
        }
    }
}

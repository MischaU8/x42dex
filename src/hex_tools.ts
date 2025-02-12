import { Vector, vec } from "excalibur";

export function hex_to_pixel(q: number, r: number, size: number): Vector {
    var x = size * 3/2 * q
    var y = size * Math.sqrt(3) * (r - 0.5 * (q&1))
    return vec(x, y)
}

export function pixel_to_flat_hex(point: Vector, size: number): [number, number] {
    var q = ( 2./3 * point.x                        ) / size
    var r = (-1./3 * point.x  +  Math.sqrt(3)/3 * point.y) / size
    return axial_to_evenq(axial_round(q, r))
}

export function axial_round(x: number, y: number): [number, number] {
    const xgrid = Math.round(x), ygrid = Math.round(y);
    x -= xgrid, y -= ygrid; // remainder
    const dx = Math.round(x + 0.5*y) * (x*x >= y*y ? 1 : 0);
    const dy = Math.round(y + 0.5*x) * (x*x < y*y ? 1 : 0);
    return [xgrid + dx, ygrid + dy];
}

export function axial_to_evenq([q, r]: [number, number]): [number, number] {
    var col = q
    var row = r + (q + (q&1)) / 2
    return [col, row]
};

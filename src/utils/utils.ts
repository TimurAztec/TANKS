import {Point} from "pixi.js";
import {TILE_SIZE} from "../entities/entity-factory";

export type AABBData = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export function randNum(max: number, min: number = 0): number {
    return Math.random() * max + min;
}

export function getTitlePosition(cords: Point): Point {
    const row = Math.floor(cords.y / TILE_SIZE);
    const column = Math.floor(cords.x / TILE_SIZE);
    return new Point(column, row);
}

export function AABB(a: AABBData, b: AABBData): boolean {
    return (a.x - a.width / 2 < b.x + b.width / 2 &&
        a.x + a.width / 2 > b.x - b.width / 2 &&
        a.y - a.height / 2 < b.y + b.height / 2 &&
        a.y + a.height / 2 > b.y - b.height / 2)
}

// export type constr<T> = { new(...args: unknown[]): T }
export type constr<T> = Function & { prototype: T }

export type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ 
    [Q in P]: T[P];
  }, { 
    -readonly [Q in P]: T[P];
  }, P>
}[keyof T];

export type Mapper<T> = Pick<{
    [K in keyof T]: { 
      name: K;
      type: T[K];
    };
}, WritableKeys<T>>;
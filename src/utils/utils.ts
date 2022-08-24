import {Point} from "pixi.js";

export type AABBData = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export function randNum(max: number, min: number = 0): number {
    return Math.random() * max + min;
}

export function validatePointIsPositive(point: Point): boolean {
    return (point.x !== null && point.x !== undefined && point.x >= 0) && (point.y !== null && point.y !== undefined && point.y >= 0)
}

export function getTitlePosition(cords: Point, tileSize: number): Point {
    const row = Math.floor(cords.y / tileSize);
    const column = Math.floor(cords.x / tileSize);
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

export interface IIndexable {
  [key: string]: any;
}
type AABBData = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export function randNum(max: number, min: number = 0): number {
    return Math.random() * max + min;
}

export function AABB(a: AABBData, b: AABBData): boolean {
    return (a.x - a.width / 2 < b.x + b.width / 2 &&
        a.x + a.width / 2 > b.x - b.width / 2 &&
        a.y - a.height / 2 < b.y + b.height / 2 &&
        a.y + a.height / 2 > b.y - b.height / 2)
}

// export type constr<T> = { new(...args: unknown[]): T }
export type constr<T> = Function & { prototype: T }
export function randNum(max: number, min: number = 0): number {
    return Math.random() * max + min;
}

// export type constr<T> = { new(...args: unknown[]): T }
export type constr<T> = Function & { prototype: T }
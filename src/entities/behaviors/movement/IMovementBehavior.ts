import {IBehavior} from "../IBehavior";
import {Point} from "pixi.js";

export interface IMovementBehavior extends IBehavior {
    setSpeed(speed: number): void;
    setRotationSpeed(speed: number): void;
    setMovementVector(vector: Point): void;
    resetMove(): void;
    stop(): void;
    update(dt: number): void;
}
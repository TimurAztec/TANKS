import {IComponent} from "../IComponent";
import {Point} from "pixi.js";

export interface IMovementComponent extends IComponent {
    setRotationSpeed(speed: number): void;
    setMovementVector(vector: Point): void;
    collides(): void;
    stop(): void;
    update(dt: number): void;
}
import {IMovementBehavior} from "./IMovementBehavior";
import {AbstractBehavior} from "../AbstractBehavior";
import {Point} from "pixi.js";

export class AbstractMovementBehavior extends AbstractBehavior implements IMovementBehavior {

    protected _previousPosition: Point = new Point();
    protected _movementVector: Point = new Point();
    protected _speed: number = 0;
    protected _rotationSpeed: number = 0;

    public setSpeed(speed: number): void {
        this._speed = speed;
    }

    public setRotationSpeed(speed: number): void {
        this._rotationSpeed = speed;
    }

    public setMovementVector(vector: Point): void {
        this._movementVector = vector;
    }

    public resetMove(): void {
        this._entity.position = this._previousPosition;
    }

    public stop(): void {
        this._speed = 0;
        this._rotationSpeed = 0;
    }

    public update(dt: number): void {
        this._previousPosition.copyFrom(this._entity.position);
        this._entity.x += this._movementVector.x;
        this._entity.y += this._movementVector.y;
        this._entity.angle += this._rotationSpeed;
    }
}
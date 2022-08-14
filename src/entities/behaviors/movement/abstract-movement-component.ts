import {IMovementComponent} from "./IMovementComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Point} from "pixi.js";

export abstract class AbstractMovementComponent extends AbstractComponent implements IMovementComponent {

    // IgnoreDT needed for smooth collision
    protected _ignoreDT: boolean = false;
    protected _previousPosition: Point = new Point();
    protected _movementVector: Point = new Point();
    protected _rotationSpeed: number = 0;
    protected _rotationTo: number = undefined;

    public setRotationSpeed(speed: number): void {
        this._rotationSpeed = speed;
    }

    public rotateTo(angle: number): void {
        this._rotationTo = angle;
    }

    public setMovementVector(vector: Point): void {
        this._movementVector = vector;
    }

    public stop(): void {
        this._movementVector = new Point();
        this._rotationSpeed = 0;
    }

    public collides(): void {
        this.stop();
        this._entity.position = this._previousPosition;
        this._ignoreDT = true;
    }

    public update(dt: number): void {
        this._previousPosition.copyFrom(this._entity.position);
        this._entity.x += this._ignoreDT ? this._movementVector.x : this._movementVector.x * dt;
        this._entity.y += this._ignoreDT ? this._movementVector.y : this._movementVector.y * dt;
        this._entity.angle = this._rotationTo ?? (this._entity.angle + this._rotationSpeed * dt);
        this._rotationTo = undefined;
        this._ignoreDT = false;
    }
}
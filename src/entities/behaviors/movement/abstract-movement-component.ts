import {IMovementComponent} from "./IMovementComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Point} from "pixi.js";

export abstract class AbstractMovementComponent extends AbstractComponent implements IMovementComponent {

    protected readonly _typeID: string = 'movement';
    // IgnoreDT needed for smooth collision
    protected _ignoreDT: boolean = false;
    protected _previousPosition: Point = new Point();
    protected _movementVector: Point = new Point();
    protected _rotationSpeed: number = 0;
    protected _rotationTo: number = undefined;
    protected _onEntityMoved: Function;

    public get previousPosition(): Point {
        return this._previousPosition;
    }

    public get rotationVector(): Point {
        const radAngle: number = (this._entity.angle-90) * (Math.PI/180);
        const vector = new Point(
            (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)) * this._entity.width,
            (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle)) * this._entity.height
        );
        return new Point(
            this._entity.x + (vector.x >= 0 ? Math.ceil(vector.x) : Math.floor(vector.x)),
            this._entity.y + (vector.y >= 0 ? Math.ceil(vector.y) : Math.floor(vector.y))
        )
    }

    public setRotationSpeed(speed: number): AbstractMovementComponent {
        this._rotationSpeed = speed;
        return this;
    }

    public rotateTo(angle: number): AbstractMovementComponent {
        this._rotationTo = angle;
        return this;
    }

    public setMovementVector(vector: Point): AbstractMovementComponent {
        this._movementVector = vector;
        return this;
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

    public onEntityMoved(callback: Function): AbstractMovementComponent {
        this._onEntityMoved = callback;
        return this;
    }

    public update(dt: number): void {
        if (!this._entity || this._entity.destroyed) return;
        if (!this._previousPosition.equals(this._entity.position) && this._onEntityMoved) {
            this._onEntityMoved(this._movementVector, this._previousPosition);
        }
        this._previousPosition.copyFrom(this._entity.position);
        this._entity.x += this._ignoreDT ? this._movementVector.x : this._movementVector.x * dt;
        this._entity.y += this._ignoreDT ? this._movementVector.y : this._movementVector.y * dt;
        this._entity.angle = this._rotationTo ?? (this._entity.angle + this._rotationSpeed * dt);
        this._rotationTo = undefined;
        this._ignoreDT = false;
    }
}
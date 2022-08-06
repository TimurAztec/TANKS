import {Point} from "pixi.js";
import {AbstractMovementBehavior} from "./abstract-movement-behavior";

export class DirectionalWalkMovementBehavior extends AbstractMovementBehavior {

    protected setRotation(angle: number): void {
        this.setRotationSpeed(angle - this._entity.angle);
    }

    public setMovementVector(vector: Point): void {
        super.setMovementVector(vector);
        if (vector.x > 0) {
            this.setRotationSpeed(90 - this._entity.angle)
        }
        if (vector.x < 0) {
            this.setRotationSpeed(270 - this._entity.angle)
        }
    }

    public stop(): void {
        super.stop();
        this.setMovementVector(new Point());
    }

    public update(dt: number): void {
        super.update(dt);
        this.stop();
    }
}
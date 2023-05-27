import {Point} from "pixi.js";
import {AbstractMovementComponent} from "./abstract-movement-component";

export class DirectionalWalkMovementBehavior extends AbstractMovementComponent {

    public setMovementVector(vector: Point): DirectionalWalkMovementBehavior {
        if (vector.y < 0) {
            vector.x = 0;
            this.rotateTo(0);
        }
        if (vector.y > 0) {
            vector.x = 0;
            this.rotateTo(180);
        }
        if (vector.x < 0) {
            vector.y = 0;
            this.rotateTo(270);
        }
        if (vector.x > 0) {
            vector.y = 0;
            this.rotateTo(90);
        }
        return super.setMovementVector(vector) as DirectionalWalkMovementBehavior;
    }

    public update(dt: number): void {
        super.update(dt);
        this.stop();
    }
}
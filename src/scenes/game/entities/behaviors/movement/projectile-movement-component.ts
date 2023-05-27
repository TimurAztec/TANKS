import {Point} from "pixi.js";
import {AbstractMovementComponent} from "./abstract-movement-component";

export class ProjectileMovementComponent extends AbstractMovementComponent {

    public setMovementVector(vector: Point): ProjectileMovementComponent {
        this.rotateTo(Math.atan2((0 - -vector.x), (0 - vector.y)) * (180 / Math.PI));
        return super.setMovementVector(vector) as ProjectileMovementComponent;
    }

}
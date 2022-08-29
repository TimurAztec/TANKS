import {AbstractMovementComponent} from "./abstract-movement-component";

export class StaticMovementComponent extends AbstractMovementComponent {

    public clone(): StaticMovementComponent { return new StaticMovementComponent(this) }
}
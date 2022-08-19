import {RandomControlComponent} from "../../behaviors/control/random-control-component";
import {DirectionalWalkMovementBehavior} from "../../behaviors/movement/direct-walk-movement-component";
import { AmountBasedSpawner } from "./amount-based-spawner";
import {AbstractControlComponent} from "../../behaviors/control/abstract-control-component";
import {AbstractMovementComponent} from "../../behaviors/movement/abstract-movement-component";
import {Point} from "pixi.js";
import {IComponent} from "../../behaviors/IComponent";
import {BasicAabbCollisionComponent} from "../../behaviors/collision/basic-aabb-collision-component";
import {Entity} from "../../entity";

class WanderingAmountBasedSpawner extends AmountBasedSpawner {

    constructor(source?: WanderingAmountBasedSpawner) {
        super(source);
        this.setComponent(new RandomControlComponent());
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case 'HardWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'SmallWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Water':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
            }
        }));
    }

    public clone(): WanderingAmountBasedSpawner {
        return new WanderingAmountBasedSpawner(this);
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (Object.getPrototypeOf(component) instanceof AbstractControlComponent) {
            this.getComponent(AbstractControlComponent).onActionUp(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, -1));
            });
            this.getComponent(AbstractControlComponent).onActionDown(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, 1));
            });
            this.getComponent(AbstractControlComponent).onActionRight(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(1, 0));
            });
            this.getComponent(AbstractControlComponent).onActionLeft(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(-1, 0));
            });
        }
    }
}

export { WanderingAmountBasedSpawner }
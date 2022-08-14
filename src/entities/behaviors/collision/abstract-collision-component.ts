import {ICollisionComponent} from "./ICollisionComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Entity} from "../../entity";

abstract class AbstractCollisionComponent extends AbstractComponent implements ICollisionComponent {
    protected collisionCallback: Function;

    public onCollidedWith(callback: Function): AbstractCollisionComponent { this.collisionCallback = callback; return this }

    public collidedWith(object: Entity): void { this.collisionCallback(object); }
}

export { AbstractCollisionComponent }
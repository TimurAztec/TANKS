import {ICollisionComponent} from "./ICollisionComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Entity} from "../../entity";
import {SceneManager} from "../../../scene-manager";

abstract class AbstractCollisionComponent extends AbstractComponent implements ICollisionComponent {
    protected collisionCallback: Function;

    public abstract checkCollisions(objects: Entity[]): void;

    public onCollidedWith(callback: Function): AbstractCollisionComponent { this.collisionCallback = callback; return this }

    public collidedWith(object: Entity): void { this.collisionCallback(object); }

    public update(dt: number): void {
        this.checkCollisions(SceneManager.currentScene.children as Entity[]);
    }
}

export { AbstractCollisionComponent }
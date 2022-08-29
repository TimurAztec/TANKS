import {ICollisionComponent} from "./ICollisionComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Entity} from "../../entity";

abstract class AbstractCollisionComponent extends AbstractComponent implements ICollisionComponent {

    protected readonly _typeID: string = 'collision';
    protected _collisionCallback: Function;
    protected _collisionGroup: Entity[] = [];

    constructor(source?: AbstractCollisionComponent) {
        super(source);
        if (source?._collisionCallback) this._collisionCallback = source._collisionCallback;
    }

    public onCollidedWith(callback: Function): AbstractCollisionComponent { this._collisionCallback = callback; return this }

    public collidedWith(object: Entity): void { this._collisionCallback(object); }

    public abstract setCollisionGroup(objects: Entity[]): AbstractCollisionComponent;

    public getCollisionGroup(): Entity[] {
        return this._collisionGroup;
    };
}

export { AbstractCollisionComponent }
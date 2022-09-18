import {ICollisionComponent} from "./ICollisionComponent";
import {AbstractComponent} from "../AbstractComponent";
import {Entity} from "../../entity";

abstract class AbstractCollisionComponent extends AbstractComponent implements ICollisionComponent {

    protected readonly _typeID: string = 'collision';
    protected _collisionCallback: Function;
    protected _collisionsMap: Map<string, Function>;
    protected _collisionGroup: Entity[] = [];

    constructor(source?: AbstractCollisionComponent) {
        super(source);
        this._collisionsMap = new Map<string, Function>();
        if (source?._collisionCallback) this._collisionCallback = source._collisionCallback;
        if (source?._collisionsMap) this._collisionsMap = source._collisionsMap;
    }

    public onCollision(callback: Function): AbstractCollisionComponent { this._collisionCallback = callback; return this }

    public onCollidedWith(id: string, callback: Function): AbstractCollisionComponent { 
        this._collisionsMap.set(id, callback); 
        return this
    }

    public collidedWith(object: Entity): void { 
        if (this._entity == object) return;
        if (this._collisionCallback) {
            this._collisionCallback(object);
        }
        const objectName: string = object.entityType;
        if (this._collisionsMap.get(objectName)) {
            this._collisionsMap.get(objectName)(object);
        }
    }

    public abstract setCollisionGroup(objects: Entity[]): AbstractCollisionComponent;

    public getCollisionGroup(): Entity[] {
        return this._collisionGroup;
    };
}

export { AbstractCollisionComponent }
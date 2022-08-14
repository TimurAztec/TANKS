import {AbstractCollisionComponent} from "./abstract-collision-component";
import { Entity } from "../../entity";

class BasicAabbCollisionComponent extends AbstractCollisionComponent {
    public getCollisionGroup(): Entity[] {
        return this._collisionGroup;
    }

    public setCollisionGroup(objects: Entity[]): BasicAabbCollisionComponent {
        this._collisionGroup = objects;
        return this;
    }
}

export { BasicAabbCollisionComponent }
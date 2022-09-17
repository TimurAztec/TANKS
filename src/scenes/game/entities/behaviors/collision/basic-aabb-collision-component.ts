import {AbstractCollisionComponent} from "./abstract-collision-component";
import { Entity } from "../../entity";
import { AABB } from "../../../../../utils/utils";

class BasicAabbCollisionComponent extends AbstractCollisionComponent {
    public getCollisionGroup(): Entity[] {
        return this._collisionGroup;
    }

    public setCollisionGroup(objects: Entity[]): BasicAabbCollisionComponent {
        this._collisionGroup = objects;
        return this;
    }

    public update(dt: number): void {
        if (!this._entity.destroyed) {
            let i: number = this._collisionGroup.length;
            while (i--) {
                if (this._collisionGroup[i] && this._collisionGroup[i] !== this._entity &&
                    AABB(this._entity.simpleBounds, this._collisionGroup[i].simpleBounds)) {
                    this.collidedWith(this._collisionGroup[i]);
                }
            }
        }
    }
}

export { BasicAabbCollisionComponent }
import {AbstractCollisionComponent} from "./abstract-collision-component";
import {AABB} from "../../../utils/utils";
import { Entity } from "../../entity";

class DoubleAabbCollisionComponent extends AbstractCollisionComponent {
    getCollisionGroup(): Entity[] {
        return this._collisionGroup;
    }

    setCollisionGroup(objects: Entity[]): DoubleAabbCollisionComponent {
        this._collisionGroup = [];
        let i = objects.length;
        while (i--) {
            let object = objects[i];
            if (this._entity != object &&
                AABB({
                ...this._entity.simpleBounds,
                width: this._entity.width * 2,
                height: this._entity.height * 2,
            }, object.simpleBounds)) {
                this._collisionGroup.push(object);
            }
        }
        return this;
    }
}

export { DoubleAabbCollisionComponent }
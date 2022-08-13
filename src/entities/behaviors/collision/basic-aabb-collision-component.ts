import {Entity} from "../../entity";
import {AbstractCollisionComponent} from "./abstract-collision-component";

type AABBWorkerData = {
    x: number,
    y: number,
    width: number,
    height: number
}

class BasicAabbCollisionComponent extends AbstractCollisionComponent {

    public checkCollisions(objects: Entity[]): void {
        let len: number = objects.length;
        while (len--) {
            const aabb = (a: AABBWorkerData, b: AABBWorkerData) => {
                return (a.x - a.width / 2 < b.x + b.width / 2 &&
                    a.x + a.width / 2 > b.x - b.width / 2 &&
                    a.y - a.height / 2 < b.y + b.height / 2 &&
                    a.y + a.height / 2 > b.y - b.height / 2)
            }
            try {
                if (aabb({
                    x: this._entity.x,
                    y: this._entity.y,
                    width: this._entity.width,
                    height: this._entity.height
                }, {
                    x: objects[len].x,
                    y: objects[len].y,
                    width: objects[len].width,
                    height: objects[len].height
                })) {
                    this.collidedWith(objects[len]);
                }
            } catch (e) {}
        }
    }

}

export { BasicAabbCollisionComponent }
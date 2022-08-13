import {Entity} from "../../entity";
import {AbstractCollisionComponent} from "./abstract-collision-component";

type AABBWorkerData = {
    x: number,
    y: number,
    width: number,
    height: number
}

class WorkerAabbCollisionComponent extends AbstractCollisionComponent {
    protected _CollisionWorker: Worker;
    protected _objects: Entity[] = [];

    constructor() {
        super();
        this._CollisionWorker = new Worker(URL.createObjectURL( new Blob([ '(',

            function(){
                onmessage = (e) => {
                    const a = e.data[0] as AABBWorkerData;
                    const b = e.data[1] as AABBWorkerData;
                    const index = e.data[2] as number;

                    if ((a.x - a.width / 2 < b.x + b.width / 2 &&
                        a.x + a.width / 2 > b.x - b.width / 2 &&
                        a.y - a.height / 2 < b.y + b.height / 2 &&
                        a.y + a.height / 2 > b.y - b.height / 2)) {
                        postMessage(index)
                    }
                }
            }.toString(),

            ')()' ], { type: 'application/javascript' } ) ));

        this._CollisionWorker.onmessage = (e) => {
            if (e.data[0] && this._objects[e.data[0]]) {
                console.log(e.data[0]);
                this.collidedWith(this._objects[e.data[0]]);
            }
        }
    }

    public checkCollisions(objects: Entity[]): void {
        this._objects = objects;
        let len: number = objects.length;
        while (len--) {
            this._CollisionWorker.postMessage([{
                x: this._entity.x,
                y: this._entity.y,
                width: this._entity.width,
                height: this._entity.height
            },{
                x: objects[len].x,
                y: objects[len].y,
                width: objects[len].width,
                height: objects[len].height
            },
            len
            ]);
        }
    }

}

export { WorkerAabbCollisionComponent }
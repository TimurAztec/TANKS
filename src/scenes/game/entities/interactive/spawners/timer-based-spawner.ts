import { Entity } from "../../entity";
import { Spawner } from "./spawner";
import {BasicAabbCollisionComponent} from "../../behaviors/collision/basic-aabb-collision-component";

class TimerBasedSpawner extends Spawner {
    protected _timeBetweenSpawns: number = 0;
    protected _collisionGroup: string[] = [];
    protected _collides: boolean = false;

    constructor(source?: TimerBasedSpawner) {
        super(source);
        this.setComponent(new BasicAabbCollisionComponent().onCollision((object: Entity) => {
            if (this._collisionGroup.includes(object.entityType)) this._collides = true;
        }));
    }

    public setTimeBetweenSpawns(time: number): TimerBasedSpawner {
        this._timeBetweenSpawns = time;
        return this;
    }

    public setCollisionGroup(collisionGroup: string[]): TimerBasedSpawner {
        this._collisionGroup = collisionGroup;
        return this;
    }

    public setPrototypeEntity<T extends Entity>(entity: T): TimerBasedSpawner {
        return super.setPrototypeEntity(entity) as TimerBasedSpawner;
    }

    public update(dt: number): void {
        super.update(dt);
        this._collides = false;
        if (this._dttimer < this._timeBetweenSpawns || this._collides) return;
        this._dttimer = 0;
        this.spawn();
    }

}

export { TimerBasedSpawner }
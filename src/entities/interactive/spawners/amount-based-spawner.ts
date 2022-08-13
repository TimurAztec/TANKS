import { Entity } from "../../entity";
import {Spawner} from "./spawner";
import {BasicAabbCollisionComponent} from "../../behaviors/collision/basic-aabb-collision-component";

class AmountBasedSpawner extends Spawner {
    protected _timesToSpawn: number;
    protected _maxAmountPerTime: number;
    protected _entities: Entity[] = [];
    protected _timeBetweenSpawns: number = 0;
    protected _collisionGroup: string[] = [];
    protected _collides: boolean = false;

    constructor(source?: AmountBasedSpawner) {
        super(source);
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            if (this._collisionGroup.includes(object.entityType)) this._collides = true;
        }));
    }

    public clone(): AmountBasedSpawner {
        return new AmountBasedSpawner(this);
    }

    public setTimeBetweenSpawns(time: number): AmountBasedSpawner {
        this._timeBetweenSpawns = time;
        return this;
    }

    public setTimesToSpawn(times: number): AmountBasedSpawner {
        this._timesToSpawn = times;
        return this
    }

    public setMaxAmountPerTime(amount: number): AmountBasedSpawner {
        this._maxAmountPerTime = amount;
        return this
    }

    public setCollisionGroup(collisionGroup: string[]): AmountBasedSpawner {
        this._collisionGroup = collisionGroup;
        return this;
    }

    public setPrototypeEntity<T extends Entity>(entity: T): AmountBasedSpawner {
        return super.setPrototypeEntity(entity) as AmountBasedSpawner;
    }

    public update(dt: number): void {
        super.update(dt);
        this._collides = false;
        if (this._timesToSpawn && this._dttimer > this._timeBetweenSpawns && !this._collides) {
            this._dttimer = 0;
            this._entities = this._entities.filter((entity) => {
                return !entity.destroyed
            });
            if (this._entities.length < this._maxAmountPerTime) {
                this._entities.push(this.spawn());
                this._timesToSpawn--;
            }
        }
    }

}

export { AmountBasedSpawner }
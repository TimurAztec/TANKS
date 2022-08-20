import {Entity} from "../../entity";
import {SceneManager} from "../../../scene-manager";

abstract class Spawner extends Entity {
    protected _prototypeEntity: Entity;
    protected _dttimer: number = 0;
    protected _timeBetweenSpawns: number = 0;

    public setPrototypeEntity<T extends Entity>(entity: T): Spawner {
        this._prototypeEntity = entity;
        return this
    }

    public update(dt: number): void {
        super.update(dt);
        this._dttimer += dt;
    }

    public spawn(): Entity {
        const entity: Entity = this._prototypeEntity.clone();
        entity.x = this.x;
        entity.y = this.y;
        SceneManager.currentScene.addChild(entity);
        return entity;
    }

}

export { Spawner }
import { Entity } from "../../entity";
import { AbstractMovementComponent } from "../movement/abstract-movement-component";
import { AbstractTeamComponent } from "../team/abstract-team-component";
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";
import {EntityFactory} from "../../entity-factory";
import { SceneManager } from "../../../../../scene-manager";
import { GameConstants } from "../../../game-constants";
import { WanderingAmountBasedSpawner } from "../../interactive/spawners/wandering-amount-based-spawner";

class SpawnSupportBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-spawn';

    protected firstUpdate(): void {
        if (this._entity.getComponent(AbstractTeamComponent)) {
            let support: Entity;
            if (this._entity.getComponent(AbstractTeamComponent).getTeam() == GameConstants.Teams.PLAYER_1) {
                support = EntityFactory.getEntity(GameConstants.EntityIDs.PLAYER_TRACTOR);
            }
            if (this._entity.getComponent(AbstractTeamComponent).getTeam() == GameConstants.Teams.PLAYER_2) {
                support = EntityFactory.getEntity(GameConstants.EntityIDs.ENEMY_SUPPORT_TANK);
            }
            const spawner = new WanderingAmountBasedSpawner().setPrototypeEntity(support)
                    .setTimeBetweenSpawns(0)
                    .setCollisionGroup([
                        GameConstants.EntityTypes.TANK,
                        GameConstants.EntityTypes.TRACTOR,
                        GameConstants.EntityTypes.DEAD_TANK,
                        GameConstants.EntityTypes.HARD_WALL,
                        GameConstants.EntityTypes.SMALL_WALL,
                        GameConstants.EntityTypes.WATER,
                        GameConstants.EntityTypes.AT_HEDGEHOGS,
                        GameConstants.EntityTypes.BASE
                    ])
                    .setTimesToSpawn(1)
                    .setMaxAmountPerTime(1);
            spawner.setSkin({hitboxWidth: 32, hitboxHeight: 32})
            if (this._entity.getComponent(AbstractMovementComponent)) {
                const vec = this._entity.getComponent(AbstractMovementComponent).rotationVector;
                spawner.x = this._entity.x * (this._entity.x / (vec.x));
                spawner.y = this._entity.y * (this._entity.y / (vec.y));
            } else {
                spawner.x = this._entity.x;
                spawner.y = this._entity.y;
            }
            SceneManager.currentScene.addChild(spawner);
            
        }
        super.firstUpdate();
    }

    public clone(): SpawnSupportBuffComponent { return new SpawnSupportBuffComponent(this) }

}

export {SpawnSupportBuffComponent}
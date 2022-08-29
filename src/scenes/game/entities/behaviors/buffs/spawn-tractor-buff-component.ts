import { Entity } from "../../entity";
import { AbstractMovementComponent } from "../movement/abstract-movement-component";
import { AbstractTeamComponent } from "../team/abstract-team-component";
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";
import {EntityFactory} from "../../entity-factory";
import { SceneManager } from "../../../../../scene-manager";
import { GameConstants } from "../../../game-constants";

class SpawnSupportBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-spawn';

    protected firstUpdate(): void {
        if (this._entity.getComponent(AbstractTeamComponent)) {
            let support: Entity;
            if (this._entity.getComponent(AbstractTeamComponent).getTeam() == GameConstants.Teams.PLAYER_1) {
                support = EntityFactory.getEntity(903);
            }
            if (this._entity.getComponent(AbstractTeamComponent).getTeam() == GameConstants.Teams.PLAYER_2) {
                support = EntityFactory.getEntity(905);
            }
            if (this._entity.getComponent(AbstractMovementComponent)) {
                const vec = this._entity.getComponent(AbstractMovementComponent).rotationVector;
                support.x = this._entity.x * (this._entity.x / vec.x);
                support.y = this._entity.y * (this._entity.y / vec.y);
            } else {
                support.x = this._entity.x;
                support.y = this._entity.y;
            }
            SceneManager.currentScene.addChild(support);
        }
        super.firstUpdate();
    }

    public clone(): SpawnSupportBuffComponent { return new SpawnSupportBuffComponent(this) }

}

export {SpawnSupportBuffComponent}
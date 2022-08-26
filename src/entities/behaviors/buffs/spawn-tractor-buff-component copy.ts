import { SceneManager } from "../../../scene-manager";
import { Tractor } from "../../interactive/tractor";
import { RandomControlComponent } from "../control/random-control-component";
import { AbstractMovementComponent } from "../movement/abstract-movement-component";
import { AbstractTeamComponent } from "../team/abstract-team-component";
import { BasicTeamComponent } from "../team/basic-team-component";
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class SpawnTractorBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-spawn';

    protected firstUpdate(): void {
        const tractor = new Tractor();
        tractor.setSkin({assetName: 'tractor', scaleX: 1.2, numberOfFrames: 4});
        tractor.setComponent(new RandomControlComponent());
        if (this._entity.getComponent(AbstractTeamComponent)) {
            tractor.setComponent(this._entity.getComponent(AbstractTeamComponent).clone());
        } else {
            tractor.setComponent(new BasicTeamComponent().setTeam('wild-tractor'));
        }

        if (this._entity.getComponent(AbstractMovementComponent)) {
            const vec = this._entity.getComponent(AbstractMovementComponent).rotationVector;
            tractor.x = this._entity.x * (this._entity.x / vec.x);
            tractor.y = this._entity.y * (this._entity.y / vec.y);
        } else {
            tractor.x = this._entity.x;
            tractor.y = this._entity.y;
        }
        SceneManager.currentScene.addChild(tractor);
        super.firstUpdate();
    }

    public clone(): SpawnTractorBuffComponent { return new SpawnTractorBuffComponent(this) }

}

export {SpawnTractorBuffComponent}
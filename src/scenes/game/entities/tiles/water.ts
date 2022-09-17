import { Howl } from "howler";
import { Loader } from "pixi.js";
import { Constants } from "../../../../constants";
import { SceneManager } from "../../../../scene-manager";
import { getTitlePosition, validatePointIsPositive } from "../../../../utils/utils";
import { GameConstants } from "../../game-constants";
import { AbstractCollisionComponent } from "../behaviors/collision/abstract-collision-component";
import { BasicAabbCollisionComponent } from "../behaviors/collision/basic-aabb-collision-component";
import { AbstractControlComponent } from "../behaviors/control/abstract-control-component";
import { StaticMovementComponent } from "../behaviors/movement/static-movement-component";
import {Entity} from "../entity";
import { Splash } from "../fx/splash";

class Water extends Entity {
    protected _objectToDrown: Entity;

    constructor(source?: Water) {
        super(source);
        this.setSkin({ assetName: Constants.AssetsTextures.WATER });
        this.setComponent(new StaticMovementComponent());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            const drownObject: string[] = [
                GameConstants.EntityTypes.TANK,
                GameConstants.EntityTypes.DEAD_TANK,
                GameConstants.EntityTypes.TRACTOR,
                GameConstants.EntityTypes.SOLDIER
            ];
            if (drownObject.includes(object.entityType)) { this.drown(object); }
        }));
    }

    protected drown(object: Entity): void {
        if (this._objectToDrown !== object && this._objectToDrown && !this._objectToDrown.destroyed) {
            this._objectToDrown.destroy();
            return;
        }
        this._objectToDrown = object;
        this._objectToDrown.x = this.x;
        this._objectToDrown.y = this.y;
        this._objectToDrown.removeComponent(AbstractControlComponent);
    }

    public updateTilingData(tileMap: any[][], tileSize: number): void {
        const tilePos = getTitlePosition(this.position, tileSize);
        if (!tileMap || !validatePointIsPositive(tilePos)) return;
        let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
    }

    public update(dt: number): void {
        super.update(dt);
        if (this._objectToDrown && !this._objectToDrown.destroyed) {
            this._objectToDrown.scale.x = this._objectToDrown.scale.y -= 0.005;
            if (this._objectToDrown.scale.x <= 0.75) {
                this._objectToDrown.destroy();
                const fx = new Splash();
                fx.x = this.x;
                fx.y = this.y;
                SceneManager.currentScene.addChild(fx);
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.WATER_SPLASH].url}).play();
            }
        }
    }
}

export { Water }
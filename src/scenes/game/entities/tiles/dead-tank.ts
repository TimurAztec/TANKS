import {Entity} from "../entity";
import {BigExplosionFX} from "../fx/big-explosion";
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { SkinOptions } from "../interfaces";
import { SceneManager } from "../../../../scene-manager";
import { Constants } from "../../../../constants";
import { StaticMovementComponent } from "../behaviors/movement/static-movement-component";

class DeadTank extends Entity {
    public health: number;
    public immortal: boolean;

    constructor(source?: DeadTank) {
        super(source);
        this.health = source?.health || 1;
        this.setSkin({assetName: Constants.AssetsTextures.TANK_DEAD, numberOfFrames: 4, animationSpeed: 0.1})
        this.setComponent(new StaticMovementComponent());
    }

    public setSkin(options?: SkinOptions): void {
        super.setSkin(options);
        this._skin.loop = true;
        this._skin.gotoAndPlay(0);
    }

    public clone(): DeadTank {
        return new DeadTank(this);
    }

    public takeDamage(damage: number): void {
        if (this.immortal) return;
        this.health -= damage;
        this.setComponent(new ImmortalBuffComponent().applyBuff(60));
    }

    public update(dt: number): void {
        if (this.health <= 0) {
            const fx = new BigExplosionFX();
            fx.x = this.x;
            fx.y = this.y;
            SceneManager.currentScene.addChild(fx);
            this.destroy();
        }
        super.update(dt);
    }
}

export { DeadTank }
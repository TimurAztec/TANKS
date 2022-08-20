import {Entity} from "../entity";
import {AnimatedSprite} from "pixi.js";
import { Assets } from "../../assets-vars";

class SmallExplosionFX extends Entity {

    constructor() {
        super();
        this.setSkin({assetName: Assets.FX.EXPLODE_SMALL, numberOfFrames: 8});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy(); }
        (this._skin as AnimatedSprite).animationSpeed = 0.1;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).gotoAndPlay(0);
    }

    update(dt: number) {
        super.update(dt);
        (this._skin as AnimatedSprite).update(dt)
    }

}

export { SmallExplosionFX }
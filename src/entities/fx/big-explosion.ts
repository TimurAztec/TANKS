import {Entity} from "../entity";
import {AnimatedSprite} from "pixi.js";

class BigExplosionFX extends Entity {

    constructor() {
        super();
        this.setSkin({assetName: 'explode', numberOfFrames: 16});
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

export { BigExplosionFX }
import {Entity} from "../entity";
import {AnimatedSprite} from "pixi.js";

class AppearFX extends Entity {

    constructor() {
        super();
        this.setSkin({assetName: 'appear', numberOfFrames: 10});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy(); }
        (this._skin as AnimatedSprite).animationSpeed = 0.2;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).gotoAndPlay(0);
    }

    update(dt: number) {
        super.update(dt);
        (this._skin as AnimatedSprite).update(dt)
    }

}

export { AppearFX }
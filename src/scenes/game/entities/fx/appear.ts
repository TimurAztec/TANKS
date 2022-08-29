import {Entity} from "../entity";
import {AnimatedSprite} from "pixi.js";
import {Constants} from "../../../../constants";

class AppearFX extends Entity {

    constructor(source?: AppearFX) {
        super(source);
        this.setSkin({assetName: Constants.AssetsTextures.APPEAR_FX, numberOfFrames: 10});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy() }
        (this._skin as AnimatedSprite).animationSpeed = 0.2;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).play();
    }

    clone(): AppearFX { return new AppearFX }

}

export { AppearFX }
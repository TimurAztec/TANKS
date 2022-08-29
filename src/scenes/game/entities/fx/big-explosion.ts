import {Entity} from "../entity";
import {AnimatedSprite, Loader} from "pixi.js";
import {Howl} from 'howler';
import {Constants} from "../../../../constants";

class BigExplosionFX extends Entity {

    constructor(source?: BigExplosionFX) {
        super(source);
        this.setSkin({assetName: Constants.AssetsTextures.EXPLODE_BIG_FX, numberOfFrames: 16});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy(); }
        (this._skin as AnimatedSprite).animationSpeed = 0.25;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).play();
        new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.EXPLODE_BIG].url}).play();
    }

    clone(): BigExplosionFX { return new BigExplosionFX }
}

export { BigExplosionFX }
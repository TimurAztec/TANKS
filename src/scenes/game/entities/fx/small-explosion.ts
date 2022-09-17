import {Entity} from "../entity";
import {AnimatedSprite, Loader} from "pixi.js";
import {Howl} from 'howler';
import {Constants} from "../../../../constants";

class SmallExplosionFX extends Entity {

    constructor(source?: SmallExplosionFX) {
        super(source);
        this.setSkin({assetName: Constants.AssetsTextures.EXPLODE_SMALL_FX, numberOfFrames: 8});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy() }
        (this._skin as AnimatedSprite).animationSpeed = 0.25;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).play();
        new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.EXPLODE_SMALL].url}).play();
    }
}

export { SmallExplosionFX }
import {Entity} from "../entity";
import {AnimatedSprite, Loader} from "pixi.js";
import {Howl} from 'howler';
import { Assets } from "../../assets-vars";

class BigExplosionFX extends Entity {

    constructor(source?: BigExplosionFX) {
        super(source);
        this.setSkin({assetName: Assets.FX.EXPLODE, numberOfFrames: 16});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy(); }
        (this._skin as AnimatedSprite).animationSpeed = 0.25;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).play();
        new Howl({ src: Loader.shared.resources['explode_sound'].url}).play();
    }

    clone(): BigExplosionFX { return new BigExplosionFX }
}

export { BigExplosionFX }
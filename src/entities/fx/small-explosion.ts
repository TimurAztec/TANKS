import {Entity} from "../entity";
import {AnimatedSprite, Loader} from "pixi.js";
import {Howl} from 'howler';

class SmallExplosionFX extends Entity {

    constructor(source?: SmallExplosionFX) {
        super(source);
        this.setSkin({assetName: 'explode_small', numberOfFrames: 8});
        (this._skin as AnimatedSprite).onComplete = () => { this.destroy() }
        (this._skin as AnimatedSprite).animationSpeed = 0.25;
        (this._skin as AnimatedSprite).loop = false;
        (this._skin as AnimatedSprite).play();
        new Howl({ src: Loader.shared.resources['hit_sound'].url}).play();
    }

    clone(): SmallExplosionFX { return new SmallExplosionFX }

}

export { SmallExplosionFX }
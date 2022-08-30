import {Entity} from "../entity";
import {Constants} from "../../../../constants";

class Splash extends Entity {

    constructor(source?: Splash) {
        super(source);
        this.setSkin({assetName: Constants.AssetsTextures.SPLASH_FX, numberOfFrames: 7});
        this._skin.onComplete = () => { this.destroy() }
        this._skin.animationSpeed = 0.2;
        this._skin.loop = false;
        this._skin.play();
    }

    clone(): Splash { return new Splash }

}

export { Splash }
import {Entity} from "../entity";
import {Loader, Sprite} from "pixi.js";

class Wall extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'wall' });
    }

    setSkin(options?: any): void {
        this.skin = new Sprite(Loader.shared.resources[options.assetName].texture);
        super.setSkin(options);
    }
}

export { Wall }
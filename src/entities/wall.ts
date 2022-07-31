import {Entity} from "./entity";
import {Loader, Sprite} from "pixi.js";

class Wall extends Entity {

    protected initBody(): void {
        this.body = new Sprite(Loader.shared.resources['wall'].texture);
    }

}

export {Wall}
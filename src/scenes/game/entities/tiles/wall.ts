import {Entity} from "../entity";
import {SmallWall} from "./small-wall";
import { ProjectileMovementComponent } from "../behaviors/movement/projectile-movement-component";
import { Constants } from "../../../../constants";
import { SceneManager } from "../../../../scene-manager";
import { StaticMovementComponent } from "../behaviors/movement/static-movement-component";

class Wall extends Entity {

    update(dt: number) {
        super.update(dt);
        for (let i = 0 ; i < 2 ; i++) {
            for (let j = 0 ; j < 2 ; j++) {
                let swall = new SmallWall();
                swall.setSkin({assetName: Constants.AssetsTextures.SMALL_WALL});
                swall.x = (this.x - swall.width/2) + (swall.width * j);
                swall.y = (this.y - swall.height/2) + (swall.height * i);
                SceneManager.currentScene.addChild(swall);
            }
        }
        this.destroy();
    }

    constructor(source?: Wall) {
        super(source);
        this.setComponent(new StaticMovementComponent());
    }

    public clone(): Wall {
        return new Wall(this);
    }

}

export { Wall }
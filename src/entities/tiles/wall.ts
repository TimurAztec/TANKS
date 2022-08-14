import {Entity} from "../entity";
import {SmallWall} from "./small-wall";
import {SceneManager} from "../../scene-manager";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";

class Wall extends Entity {

    update(dt: number) {
        super.update(dt);
        for (let i = 0 ; i < 2 ; i++) {
            for (let j = 0 ; j < 2 ; j++) {
                let swall = new SmallWall();
                swall.setSkin({assetName: `small_wall`});
                swall.x = (this.x - swall.width/2) + (swall.width * j);
                swall.y = (this.y - swall.height/2) + (swall.height * i);
                SceneManager.currentScene.addChild(swall);
            }
        }
        this.destroy();
    }

    constructor() {
        super();
        this.setComponent(new BasicAabbCollisionComponent().setCollisionGroup([]));
    }

}

export { Wall }
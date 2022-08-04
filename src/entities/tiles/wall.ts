import {Entity} from "../entity";
import {Container, Loader, Sprite} from "pixi.js";
import {SmallWall} from "./small-wall";
import {TILE_SIZE} from "./tiles-factory";

class Wall extends Entity {

    update(dt: number) {
        super.update(dt);
        // for (let i = 0 ; i < 2 ; i++) {
        //     for (let j = 0 ; j < 2 ; j++) {
        //         let swall = new SmallWall();
        //         swall.setSkin({assetName: `small_wall`, width: TILE_SIZE/2, height: TILE_SIZE/2});
        //         swall.x = (this.x - TILE_SIZE/4) + ((swall.width) * j);
        //         swall.y = (this.y - TILE_SIZE/4) + ((swall.height) * i);
        //         this.parent.addChild(swall);
        //     }
        // }
        let swall = new SmallWall();
        swall.width = TILE_SIZE;
        swall.height = TILE_SIZE;
        swall.setSkin({assetName: `small_wall`, width: TILE_SIZE, height: TILE_SIZE});
        swall.x = this.x;
        swall.y = this.y;
        this.parent.addChild(swall);
        this.destroy();
    }

}

export { Wall }
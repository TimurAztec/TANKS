import {Entity} from "../entity";
import {SmallWall} from "./small-wall";

class Wall extends Entity {

    update(dt: number) {
        super.update(dt);
        for (let i = 0 ; i < 2 ; i++) {
            for (let j = 0 ; j < 2 ; j++) {
                let swall = new SmallWall();
                swall.setSkin({assetName: `small_wall`});
                swall.x = (this.x - swall.width/2) + (swall.width * j);
                swall.y = (this.y - swall.height/2) + (swall.height * i);
                this.parent.addChild(swall);
            }
        }

        // let swall = new SmallWall();
        // swall.setSkin({assetName: `small_wall`});
        // swall.x = this.x - swall.width/2;
        // swall.y = this.y - swall.height/2;
        // this.parent.addChild(swall);
        // let swalla = new SmallWall();
        // swalla.setSkin({assetName: `small_wall`});
        // swalla.x = this.x + swall.width/2;
        // swalla.y = this.y - swalla.height/2;
        //
        // this.parent.addChild(swalla);
        this.destroy();
    }

}

export { Wall }
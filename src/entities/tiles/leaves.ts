import {Entity} from "../entity";
import {randNum} from "../../utils/utils";
import { Assets } from "../../assets-vars";

class Leaves extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: Assets.Tiles.LAEVES });
    }

    update(dt: number) {
        super.update(dt);
        if (dt > 1) {
            this._skin.skew.x = randNum(0.025);
        }
    }

}

export { Leaves }
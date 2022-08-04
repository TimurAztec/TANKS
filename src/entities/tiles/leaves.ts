import {Entity} from "../entity";
import {randNum} from "../../utils/utils";

class Leaves extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'leaves' });
    }

    update(dt: number) {
        super.update(dt);
        if (dt > 1) {
            this._skin.skew.x = randNum(0.025);
        }
    }

}

export { Leaves }
import { Constants } from "../../../../constants";
import {Entity} from "../entity";

class HardWall extends Entity {

    constructor(source?: HardWall) {
        super(source);
        this.setSkin({ assetName: Constants.AssetsTextures.HARD_WALL });
    }
}

export { HardWall }
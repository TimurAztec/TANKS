import { Constants } from "../../../../constants";
import {Entity} from "../entity";

class HardWall extends Entity {

    constructor(source?: HardWall) {
        super(source);
        this.setSkin({ assetName: Constants.AssetsTextures.HARD_WALL });
    }

    public clone(): HardWall {
        return new HardWall(this);
    }
}

export { HardWall }
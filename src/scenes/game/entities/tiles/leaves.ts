import { Constants } from "../../../../constants";
import { Entity } from "../entity";

class Leaves extends Entity {

    constructor(source?: Leaves) {
        super(source);
        this.setSkin({ assetName: Constants.AssetsTextures.LEAVES });
    }

}

export { Leaves }
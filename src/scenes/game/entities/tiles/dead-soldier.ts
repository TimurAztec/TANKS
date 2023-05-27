import { Constants } from "../../../../constants";
import {Entity} from "../entity";

class DeadSoldier extends Entity {

    constructor(source?: DeadSoldier) {
        super(source);
        this.setSkin({assetName: Constants.AssetsTextures.SOLIDER_DEAD});
    }
}

export { DeadSoldier }
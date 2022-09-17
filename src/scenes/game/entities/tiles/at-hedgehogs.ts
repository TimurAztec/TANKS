import { Constants } from "../../../../constants";
import {Entity} from "../entity";

class ATHedgehogs extends Entity {

    constructor(source?: ATHedgehogs) {
        super(source);
        this.setSkin({ assetName: Constants.AssetsTextures.AT_BARRICADE, hitboxWidth: 32, hitboxHeight: 32});
    }
}

export { ATHedgehogs }
import { Assets } from "../../assets-vars";
import {Entity} from "../entity";

class Water extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: Assets.Tiles.WATER });
    }

}

export { Water }
import { Assets } from "../../assets-vars";
import {Entity} from "../entity";

class Floor extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: Assets.Tiles.DIRT });
    }

}

export { Floor }
import { Assets } from "../../assets-vars";
import {Entity} from "../entity";

class HardWall extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: Assets.Tiles.WALL });
    }

}

export { HardWall }
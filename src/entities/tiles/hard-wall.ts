import {Entity} from "../entity";

class HardWall extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'wall' });
    }

}

export { HardWall }
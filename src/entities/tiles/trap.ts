import {Entity} from "../entity";

class Trap extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'water' });
    }

}

export { Trap }
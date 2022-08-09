import {Entity} from "../entity";

class Water extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'water' });
    }

}

export { Water }
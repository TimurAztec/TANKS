import {Entity} from "../entity";

class Floor extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'dirt' });
    }

}

export { Floor }
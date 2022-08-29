import {Entity} from "../entity";

class ATHedgehogs extends Entity {

    constructor() {
        super();
        this.setSkin({ assetName: 'at_hedgehogs', hitboxWidth: 32, hitboxHeight: 32});
    }

}

export { ATHedgehogs }
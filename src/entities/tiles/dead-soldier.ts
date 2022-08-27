import {Entity} from "../entity";

class DeadSoldier extends Entity {

    constructor(source?: DeadSoldier) {
        super(source);
        this.setSkin({assetName: 'dead_soldier'});
    }

    public clone(): DeadSoldier {
        return new DeadSoldier(this);
    }
}

export { DeadSoldier }
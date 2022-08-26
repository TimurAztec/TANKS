import {Entity} from "../entity";

class Floor extends Entity {

    constructor(source?: Floor) {
        super(source)
    }

    public clone(): Floor {
        return new Floor(this);
    }
}

export { Floor }
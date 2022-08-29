import {Entity} from "../entity";

class SmallWall extends Entity {

    constructor(source?: SmallWall) {
        super(source);
    }

    public clone(): SmallWall {
        return new SmallWall(this);
    }
}

export { SmallWall }
import {Entity} from "../entity";
import { SkinOptions } from "../interfaces";

class Floor extends Entity {

    constructor(source?: Floor) {
        super(source)
    }

    public setSkin(options?: SkinOptions): void {
        super.setSkin(options);
        this._skin.gotoAndPlay(0);
    }

}

export { Floor }
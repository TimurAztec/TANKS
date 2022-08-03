import {Entity} from "../entity";
import {HardWall} from "./interactive/hard-wall";

const TILE_SIZE: number = 36;

class TilesFactory {
    private constructor() {}

    public static getTile(tileIndex: number): Entity {
        switch (tileIndex) {
            case 1:
                return new HardWall();
            default:
                return null;
        }
    }
}

export { TilesFactory, TILE_SIZE }
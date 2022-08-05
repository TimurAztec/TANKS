import {Entity} from "../entity";
import {HardWall} from "./hard-wall";
import {Tank} from "../interactive/tank";
import {PlayerControlBehavior} from "../behaviors/control/player-control-behavior";
import {Floor} from "./floor";
import {Leaves} from "./leaves";
import {Trap} from "./trap";
import {Wall} from "./wall";

const TILE_SIZE: number = 36;

class TilesFactory {
    private constructor() {}

    public static getTile(tileIndex: number): Entity {
        switch (tileIndex) {
            case 101:
                return new Floor();
            case 102:
                return new Leaves();
            case 201:
                return new HardWall();
            case 202:
                return new Wall();
            case 777:
                return new Trap();
            case 901:
                let playerTank = new Tank();
                playerTank.setSkin({assetName: 'tank_player', width: TILE_SIZE, height: TILE_SIZE});
                playerTank.controlBehavior = new PlayerControlBehavior();
                return playerTank;
            default:
                return null;
        }
    }
}

export { TilesFactory, TILE_SIZE }
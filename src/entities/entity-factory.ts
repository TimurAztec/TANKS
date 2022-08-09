import { PlayerControlComponent } from "./behaviors/control/player-control-component";
import { BasicTeamComponent } from "./behaviors/team/basic-team-component";
import { Entity } from "./entity";
import { Tank } from "./interactive/tank";
import { Floor } from "./tiles/floor";
import { HardWall } from "./tiles/hard-wall";
import { Leaves } from "./tiles/leaves";
import { Wall } from "./tiles/wall";
import { Water } from "./tiles/water";
import {randNum} from "../utils/utils";
import { RandomControlComponent } from "./behaviors/control/random-control-component";

const TILE_SIZE: number = 36;

class EntityFactory {
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
                return new Water();
            case 901:
                const playerTank = new Tank();
                playerTank.setSkin({assetName: 'tank_player'});
                playerTank.setComponent(new PlayerControlComponent());
                playerTank.setComponent(new BasicTeamComponent().setTeam('player1'));
                playerTank.speed = 4;
                return playerTank;
            case 902:
                const tank = new Tank();
                const enemy_skins = ['tank_blue', 'tank_red', 'tank_white'];
                tank.setSkin({assetName: enemy_skins[Math.floor(randNum(3))]});
                tank.setComponent(new RandomControlComponent());
                tank.setComponent(new BasicTeamComponent().setTeam('player2'));
                return tank;
            default:
                return null;
        }
    }
}

export { EntityFactory, TILE_SIZE }
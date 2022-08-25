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
import {EnemyBulletWeaponComponent} from "./behaviors/weapon/enemy-bullet-weapon-component";
import {WanderingAmountBasedSpawner} from "./interactive/spawners/wandering-amount-based-spawner";
import { AmountBasedSpawner } from "./interactive/spawners/amount-based-spawner";
import { Buff } from "./interactive/buff";
import { Assets } from "../assets-vars";
import { Base } from "./interactive/base";
import { BulletWeaponComponent } from "./behaviors/weapon/bullet-weapon-component";
import { Tractor } from "./interactive/tractor";

class EntityFactory {
    private constructor() {}

    public static getTile(tileIndex: number): Entity {
        switch (tileIndex) {
            case 101: {
                const floor = new Floor();
                floor.setSkin({assetName: 'dirt'});
                return floor;
            }
            case 102: {
                const floor = new Floor();
                floor.setSkin({assetName: 'grass'});
                return floor;
            }
            case 112:
                return new Leaves();
            case 201:
                return new HardWall();
            case 202:
                return new Wall();
            case 211:
                return new Water();
            case 901: {
                const playerTank = new Tank();
                playerTank.setSkin({assetName: 'tank_player', scaleX: 1.2, numberOfFrames: 4});
                playerTank.setComponent(new PlayerControlComponent());
                const weapon = new BulletWeaponComponent();
                weapon.setReloadTime(50);
                playerTank.setComponent(weapon);
                playerTank.setComponent(new BasicTeamComponent().setTeam('player1'));
                return playerTank;
            }
            case 902: {
                const tank = new Tank();
                const enemy_skins = ['tank_enemy1', 'tank_enemy2', 'tank_enemy3'];
                tank.setSkin({assetName: enemy_skins[Math.floor(randNum(3))], scaleX: 1.2, numberOfFrames: 4});
                tank.setComponent(new RandomControlComponent());
                const weapon = new EnemyBulletWeaponComponent();
                weapon.setReloadTime(50);
                tank.setComponent(weapon);
                tank.setComponent(new BasicTeamComponent().setTeam('player2'));
                return tank;
            }
            case 903: {
                const playerTractor = new Tractor();
                playerTractor.setSkin({assetName: 'tractor', scaleX: 1.2, numberOfFrames: 4});
                playerTractor.setComponent(new RandomControlComponent());
                playerTractor.setComponent(new BasicTeamComponent().setTeam('player1'));
                return playerTractor;
            }
            case 912: {
                const spawner =  new AmountBasedSpawner().setPrototypeEntity(EntityFactory.getTile(902))
                    .setTimeBetweenSpawns(250)
                    .setCollisionGroup(['Tank'])
                    .setTimesToSpawn(12)
                    .setMaxAmountPerTime(3);
                    spawner.setSkin({assetName: 'eagle'})
                    return spawner
            }
            case 921:{
                const buff = new Buff();
                const buff_types = [
                    Assets.Bonuses.BONUS_IMMORTAL,
                    Assets.Bonuses.BONUS_LIVE,
                    Assets.Bonuses.BONUS_SLOW,
                    Assets.Bonuses.BONUS_SPEED    
                ];
                buff.type = buff_types[Math.floor(randNum(buff_types.length))];
                buff.setSkin({assetName: buff_types[Math.floor(randNum(buff_types.length))]});
                let spawner = new WanderingAmountBasedSpawner().setPrototypeEntity(buff)
                    .setTimeBetweenSpawns(150)
                    .setCollisionGroup(['Tank'])
                    .setTimesToSpawn(1000)
                    .setMaxAmountPerTime(1);
                    spawner.setSkin({assetName: 'empty'})
                    return spawner
            }
            case 777:{
                const base = new Base();
                base.setComponent(new BasicTeamComponent().setTeam('player1'));
                base.setSkin({assetName: 'eagle'});
                return base;
            }
            default:
                return null;
        }
    }
}

export { EntityFactory }
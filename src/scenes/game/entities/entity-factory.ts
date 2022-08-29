import { PlayerControlComponent } from "./behaviors/control/player-control-component";
import { BasicTeamComponent } from "./behaviors/team/basic-team-component";
import { Entity } from "./entity";
import { Tank } from "./interactive/tank";
import { Floor } from "./tiles/floor";
import { HardWall } from "./tiles/hard-wall";
import { Leaves } from "./tiles/leaves";
import { Wall } from "./tiles/wall";
import { Water } from "./tiles/water";
import { RandomControlComponent } from "./behaviors/control/random-control-component";
import {EnemyBulletWeaponComponent} from "./behaviors/weapon/enemy-bullet-weapon-component";
import {WanderingAmountBasedSpawner} from "./interactive/spawners/wandering-amount-based-spawner";
import { Buff } from "./interactive/buff";
import { Base } from "./interactive/base";
import { BulletWeaponComponent } from "./behaviors/weapon/bullet-weapon-component";
import { Tractor } from "./interactive/tractor";
import {BasicDestroyComponent} from "./behaviors/destroy/basic-destroy-component";
import {AbstractTeamComponent} from "./behaviors/team/abstract-team-component";
import {InWorldEventCounter} from "./interactive/in-world-event-counter";
import { Soldier } from "./interactive/soldier";
import { ATHedgehogs } from "./tiles/at-hedgehogs";
import { EventManager } from "../../../event-manager";
import { SavesHandler } from "../../../utils/saves-handler";
import {randNum} from "../../../utils/utils";
import { GameConstants } from "../game-constants";

class EntityFactory {
    private constructor() {}

    public static getEntity(entityID: number): Entity {
        switch (entityID) {
            case 101: {
                const floor = new Floor();
                floor.setSkin({assetName: 'dirt'});
                return floor;
            }
            case 102: {
                const floor = new Floor();
                floor.setSkin({assetName: 'grass', numberOfFrames: 10, animationSpeed: 0.1});
                return floor;
            }
            case 112:
                return new Leaves();
            case 201:
                return new HardWall();
            case 202:
                return new Wall();
            case 203:
                return new ATHedgehogs();
            case 211:
                return new Water();
            case 901: {
                const playerTank = new Tank();
                playerTank.setSkin({assetName: 'tank_player', scaleX: 1.2, numberOfFrames: 4});
                playerTank.setComponent(new PlayerControlComponent());
                const weapon = new BulletWeaponComponent();
                weapon.setReloadTime(50);
                playerTank.setComponent(weapon);
                playerTank.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                playerTank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    EventManager.notify('team_lost', playerTank.getComponent(AbstractTeamComponent).getTeam);
                }));
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
                tank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    EventManager.notify('entity_destroyed_player2', tank);
                    SavesHandler.saveData('score', ((SavesHandler.loadData('score') as number) + 10));
                }));
                return tank;
            }
            case 903: {
                const playerTractor = new Tractor();
                playerTractor.setSkin({assetName: 'tractor', scaleX: 1.2, numberOfFrames: 4});
                playerTractor.setComponent(new RandomControlComponent());
                playerTractor.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                return playerTractor;
            }
            case 904: {
                const soldier = new Soldier();
                soldier.setSkin({assetName: 'soldier', numberOfFrames: 13, scaleX: 0.75, scaleY: 0.5, animationSpeed: 0.5});
                soldier.setComponent(new RandomControlComponent());
                soldier.setComponent(new BasicTeamComponent().setTeam('player2'));
                return soldier;
            }
            case 905: {
                const supportTank = new Tank();
                const enemy_skins = ['tank_enemy1', 'tank_enemy2', 'tank_enemy3'];
                supportTank.setSkin({assetName: enemy_skins[Math.floor(randNum(3))], scaleX: 1.2, numberOfFrames: 4});
                supportTank.setComponent(new RandomControlComponent());
                const weapon = new EnemyBulletWeaponComponent();
                weapon.setReloadTime(50);
                supportTank.setComponent(weapon);
                supportTank.setComponent(new BasicTeamComponent().setTeam('player2'));
                supportTank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    SavesHandler.saveData('score', ((SavesHandler.loadData('score') as number) + 10));
                }));
                return supportTank;
            }
            case 912: {
                const spawner =  new WanderingAmountBasedSpawner().setPrototypeEntity(EntityFactory.getEntity(902))
                    .setTimeBetweenSpawns(250)
                    .setCollisionGroup(['Tank', 'Tractor', 'DeadTank', 'HardWall', 'SmallWall', 'Water', 'ATHedgehogs'])
                    .setTimesToSpawn(4)
                    .setMaxAmountPerTime(1);
                    spawner.setSkin({assetName: 'empty', hitboxWidth: 32, hitboxHeight: 32})
                    return spawner
            }
            case 919: {
                const counter = new InWorldEventCounter();
                counter.setComponent(new BasicTeamComponent().setTeam('player2'));
                counter
                    .timesToCount(12)
                    .setEventToCount('entity_destroyed_player2')
                    .onCountEnded(() => {
                        EventManager.notify('team_won', GameConstants.Teams.PLAYER_1);
                    });
                return counter
            }
            case 921:{
                const buff = new Buff();
                let spawner = new WanderingAmountBasedSpawner().setPrototypeEntity(buff)
                    .setTimeBetweenSpawns(600)
                    .setCollisionGroup(['Tank', 'Tractor', 'DeadTank', 'HardWall', 'SmallWall', 'Water', 'ATHedgehogs'])
                    .setTimesToSpawn(9999)
                    .setMaxAmountPerTime(1);
                    spawner.setSkin({assetName: 'empty', hitboxWidth: 32, hitboxHeight: 32})
                    return spawner
            }
            case 777:{
                const base = new Base();
                base.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                base.setSkin({assetName: 'eagle'});
                return base;
            }
            default:
                return null;
        }
    }
}

export { EntityFactory }
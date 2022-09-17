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
import { Constants } from "../../../constants";

class EntityFactory {
    protected static _instance: EntityFactory;

    protected constructor() {}

    public static instance(): EntityFactory {
        if (!EntityFactory._instance) {
            EntityFactory._instance = new EntityFactory();
        }

        return EntityFactory._instance;
    }

    public static getEntity(entityID: number): Entity {
        switch (entityID) {
            case GameConstants.EntityIDs.DIRT: {
                const floor = new Floor();
                floor.setSkin({assetName: Constants.AssetsTextures.DIRT});
                return floor;
            }
            case GameConstants.EntityIDs.GRASS: {
                const floor = new Floor();
                floor.setSkin({assetName: Constants.AssetsTextures.GRASS, numberOfFrames: 10, animationSpeed: 0.1});
                return floor;
            }
            case GameConstants.EntityIDs.LEAVES:
                return new Leaves();
            case GameConstants.EntityIDs.HARD_WALL:
                return new HardWall();
            case GameConstants.EntityIDs.WALL:
                return new Wall();
            case GameConstants.EntityIDs.AT_HEDGEHOGS:
                return new ATHedgehogs();
            case GameConstants.EntityIDs.WATER:
                return new Water();
            case GameConstants.EntityIDs.PLAYER_TANK: {
                const playerTank = new Tank();
                playerTank.setSkin({assetName: Constants.AssetsTextures.TANK_1, numberOfFrames: 4});
                playerTank.setComponent(new PlayerControlComponent());
                const weapon = new BulletWeaponComponent();
                weapon.setReloadTime(50);
                playerTank.setComponent(weapon);
                playerTank.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                playerTank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    EventManager.instance().notify(GameConstants.Events.GAME_OVER, playerTank.getComponent(AbstractTeamComponent).getTeam);
                }));
                return playerTank;
            }
            case GameConstants.EntityIDs.ENEMY_TANK: {
                const tank = new Tank();
                const enemy_skins = [Constants.AssetsTextures.TANK_2, Constants.AssetsTextures.TANK_3, Constants.AssetsTextures.TANK_4];
                tank.setSkin({assetName: enemy_skins[Math.floor(randNum(3))], numberOfFrames: 4});
                tank.setComponent(new RandomControlComponent());
                const weapon = new EnemyBulletWeaponComponent();
                weapon.setReloadTime(50);
                tank.setComponent(weapon);
                tank.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_2));
                tank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    EventManager.instance().notify(GameConstants.Events.ENTITY_DESTROY + GameConstants.Teams.PLAYER_2, tank);
                    SavesHandler.instance().saveData(Constants.GlobalNames.SCORE, ((SavesHandler.instance().loadData(Constants.GlobalNames.SCORE) as number) + 10));
                }));
                return tank;
            }
            case GameConstants.EntityIDs.PLAYER_TRACTOR: {
                const playerTractor = new Tractor();
                playerTractor.setSkin({assetName: Constants.AssetsTextures.TRACTOR, scaleX: 1.2, numberOfFrames: 4});
                playerTractor.setComponent(new RandomControlComponent());
                playerTractor.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                return playerTractor;
            }
            case GameConstants.EntityIDs.ENEMY_SOLDIER: {
                const soldier = new Soldier();
                soldier.setSkin({assetName: Constants.AssetsTextures.SOLIDER, numberOfFrames: 13, scaleX: 0.75, scaleY: 0.5, animationSpeed: 0.5});
                soldier.setComponent(new RandomControlComponent());
                soldier.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_2));
                return soldier;
            }
            case GameConstants.EntityIDs.ENEMY_SUPPORT_TANK: {
                const supportTank = new Tank();
                const enemy_skins = [Constants.AssetsTextures.TANK_2, Constants.AssetsTextures.TANK_3, Constants.AssetsTextures.TANK_4];
                supportTank.setSkin({assetName: enemy_skins[Math.floor(randNum(3))], scaleX: 1.2, numberOfFrames: 4});
                supportTank.setComponent(new RandomControlComponent());
                const weapon = new EnemyBulletWeaponComponent();
                weapon.setReloadTime(50);
                supportTank.setComponent(weapon);
                supportTank.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_2));
                supportTank.setComponent(new BasicDestroyComponent().onDestroy(() => {
                    SavesHandler.instance().saveData(Constants.GlobalNames.SCORE, ((SavesHandler.instance().loadData(Constants.GlobalNames.SCORE) as number) + 10));
                }));
                return supportTank;
            }
            case GameConstants.EntityIDs.ENEMY_SMALL_SPAWNER: {
                const spawner =  new WanderingAmountBasedSpawner().setPrototypeEntity(EntityFactory.getEntity(902))
                    .setTimeBetweenSpawns(250)
                    .setCollisionGroup([
                        GameConstants.EntityTypes.TANK,
                        GameConstants.EntityTypes.TRACTOR,
                        GameConstants.EntityTypes.DEAD_TANK,
                        GameConstants.EntityTypes.HARD_WALL,
                        GameConstants.EntityTypes.SMALL_WALL,
                        GameConstants.EntityTypes.WATER,
                        GameConstants.EntityTypes.AT_HEDGEHOGS,
                        GameConstants.EntityTypes.BASE
                    ])
                    .setTimesToSpawn(4)
                    .setMaxAmountPerTime(1);
                    spawner.setSkin({hitboxWidth: 32, hitboxHeight: 32})
                    return spawner
            }
            case GameConstants.EntityIDs.ENEMY_DEATH_COUNTER: {
                const counter = new InWorldEventCounter();
                counter.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_2));
                counter
                    .timesToCount(12)
                    .setEventToCount(GameConstants.Events.ENTITY_DESTROY + GameConstants.Teams.PLAYER_2)
                    .onCountEnded(() => {
                        EventManager.instance().notify(GameConstants.Events.TEAM_WON, GameConstants.Teams.PLAYER_1);
                    });
                return counter
            }
            case GameConstants.EntityIDs.RANDOM_BONUS_SPAWNER:{
                const buff = new Buff();
                let spawner = new WanderingAmountBasedSpawner().setPrototypeEntity(buff)
                    .setTimeBetweenSpawns(600)
                    .setCollisionGroup([
                        GameConstants.EntityTypes.TANK,
                        GameConstants.EntityTypes.TRACTOR,
                        GameConstants.EntityTypes.DEAD_TANK,
                        GameConstants.EntityTypes.HARD_WALL,
                        GameConstants.EntityTypes.SMALL_WALL,
                        GameConstants.EntityTypes.WATER,
                        GameConstants.EntityTypes.AT_HEDGEHOGS,
                        GameConstants.EntityTypes.BASE
                    ])
                    .setTimesToSpawn(9999)
                    .setMaxAmountPerTime(1);
                    spawner.setSkin({hitboxWidth: 32, hitboxHeight: 32})
                    return spawner
            }
            case GameConstants.EntityIDs.PLAYER_BASE:{
                const base = new Base();
                base.setComponent(new BasicTeamComponent().setTeam(GameConstants.Teams.PLAYER_1));
                base.setSkin({assetName: Constants.AssetsTextures.EAGLE});
                return base;
            }
            default:
                return null;
        }
    }
}

export { EntityFactory }

export namespace GameConstants {
    export class EntityTypes {
        public static readonly HARD_WALL: string = 'HardWall';
        public static readonly SMALL_WALL: string = 'SmallWall';
        public static readonly TANK: string = 'Tank';
        public static readonly TRACTOR: string = 'Tractor';
        public static readonly DEAD_TANK: string = 'DeadTank';
        public static readonly WATER: string = 'Water';
        public static readonly AT_HEDGEHOGS: string = 'ATHedgehogs';
        public static readonly BUFF: string = 'Buff';
        public static readonly BULLET: string = 'Bullet';
        public static readonly BASE: string = 'Base';
        public static readonly SOLDIER: string = 'Soldier';
        public static readonly DEAD_SOLDIER: string = 'DeadSoldier';
    }

    export class Teams {
        public static readonly PLAYER_1: string = 'player1';
        public static readonly PLAYER_2: string = 'player2';
    }

    export class Events {
        public static readonly ENTITY_DESTROY: string = 'entity_destroy';
        public static readonly TEAM_WON: string = 'team_won';
        public static readonly GAME_OVER: string = 'game_over';
    }

    export enum EntityIDs {
        DIRT = 101,
        GRASS = 102,
        STONE_PATH = 103,
        LEAVES = 112,
        HARD_WALL = 201,
        WALL = 202,
        AT_HEDGEHOGS = 203,
        WATER = 211,
        PLAYER_TANK = 901,
        ENEMY_TANK = 902,
        PLAYER_TRACTOR = 903,
        ENEMY_SOLDIER = 904,
        ENEMY_SUPPORT_TANK = 905,
        ENEMY_SMALL_SPAWNER = 912,
        ENEMY_MEDIUM_SPAWNER = 913,
        ENEMY_DEATH_COUNTER_SMALL = 916,
        ENEMY_DEATH_COUNTER_MEDIUM = 917,
        ENEMY_DEATH_COUNTER_BIG = 918,
        RANDOM_BONUS_SPAWNER = 921,
        PLAYER_BASE = 777
    }
}
export namespace Assets {
    export class Tiles {
        public static readonly SMALL_WALL: string = 'small_wall'; //+
        public static readonly WALL: string = 'wall'; //?
        public static readonly WATER: string = 'water'; //+
        public static readonly DIRT: string = 'dirt';//+
        public static readonly LAEVES: string = 'leaves';//+
        public static readonly EAGLE: string = 'eagle'; // none for now
    }
    export class Bonuses{
        public static readonly BONUS_IMMORTAL: string = 'bonus_immortal';// none for now
        public static readonly BONUS_LIVE: string = 'bonus_live';// none for now
        public static readonly BONUS_SLOW: string = 'bonus_slow';// none for now
        public static readonly BONUS_SPEED: string = 'bonus_speed';// none for now
    }
    export class Buttons{
        public static readonly BUTTON: string = 'button';//+
        public static readonly BUTTON_SCORES: string = 'button_scores';//+
    }
    export class Bullets{
        public static readonly BULLET: string = 'bullet';//+
        public static readonly BULLET_ENEMY: string = 'enemy_bullet';//+
    }
    export class FX{
        public static readonly EXPLODE: string = 'explode';//+
        public static readonly EXPLODE_SMALL: string = 'explode_small';//+
        public static readonly APPEAR: string = 'appear';//+
    }
    export class Tanks{
        public static readonly TANK_PLAYER: string = 'tank_player';//+
        public static readonly TANK_BLUE: string = 'tank_blue';//+
        public static readonly TANK_RED: string = 'tank_red';//+
        public static readonly TANK_WHITE: string = 'tank_white';//+
    }
    
}
export namespace LoaderAssets {
    export class Loaders{
        public static readonly LOADER_BACKGROUND: string = 'loader_bg';//+
        public static readonly LOADER_BAR: string = 'loader_bar';//+
    }
}
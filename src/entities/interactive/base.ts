import {Entity} from "../entity";
import {IDestroyOptions, Point} from "pixi.js";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {SceneManager} from "../../scene-manager";
import {BulletWeaponComponent} from "../behaviors/weapon/bullet-weapon-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";
import {AppearFX} from "../fx/appear";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import {GameScene} from "../../scenes/game/game-scene";
import {TILE_SIZE} from "../entity-factory";
import {AbstractCollisionComponent} from "../behaviors/collision/abstract-collision-component";
import {EventManager} from "../../event-manager";
import {getTitlePosition} from "../../utils/utils";
import {BigExplosionFX} from "../fx/big-explosion";
import {Scene} from "../../scenes/scene";
import { Vars } from "../../vars";
import { AbstractBuffComponent } from "../behaviors/buffs/abstract-buff-component";
import { Buff } from "./buff";
import { IEventListener } from "../../utils/events/IEventListener";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";

class Base extends Entity implements IEventListener {

    constructor(source?: Base) {
        super(source);
    }

    public clone(): Base {
        return new Base(this);
    }

    public onEvent(event: string, data: any): void {}

    public destroy(options?: IDestroyOptions | boolean): void {
        super.destroy(options);
        if (this.getComponent(AbstractTeamComponent)) {
            EventManager.notify('team_lost', this.getComponent(AbstractTeamComponent).getTeam);
        }
    }
    
    public update(dt: number): void {
        if (this._initOnUpdate) {
            const fx = new AppearFX();
            fx.x = this.x;
            fx.y = this.y;
            SceneManager.currentScene.addChild(fx);
        }
        super.update(dt);
    }
}

export { Base }
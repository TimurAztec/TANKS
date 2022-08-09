import {Entity} from "../entity";
import {Point} from "pixi.js";
import {TILE_SIZE} from "../tiles/entity-factory";
import {SkinOptions} from "../interfaces";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {SceneManager} from "../../scene-manager";
import {BulletWeaponComponent} from "../behaviors/weapon/bullet-weapon-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";

class Spawner extends Entity {
    public speed: number = 2;

    constructor() {
        super();
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BulletWeaponComponent());
        this.getComponent(AbstractWeaponComponent).setReloadTime(50);
    }

}

export { Spawner }
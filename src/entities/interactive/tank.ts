import {Entity} from "../entity";
import {Point} from "pixi.js";
import {TILE_SIZE} from "../tiles/tiles-factory";
import {SkinOptions} from "../interfaces";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {SceneManager} from "../../scene-manager";
import {BulletWeaponComponent} from "../behaviors/weapon/bullet-weapon-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";

class Tank extends Entity {
    protected _speed: number = 4;

    constructor() {
        super();
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BulletWeaponComponent());
        this.getComponent(AbstractWeaponComponent).setReloadTime(50);
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (Object.getPrototypeOf(component) instanceof AbstractControlComponent) {
            this.getComponent(AbstractControlComponent).onActionUp(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, -this._speed));
            });
            this.getComponent(AbstractControlComponent).onActionDown(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, this._speed));
            });
            this.getComponent(AbstractControlComponent).onActionRight(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(this._speed, 0));
            });
            this.getComponent(AbstractControlComponent).onActionLeft(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(-this._speed, 0));
            });
            this.getComponent(AbstractControlComponent).onActionSpace(() => {
                this.getComponent(AbstractWeaponComponent).fire();
            });
        }
    }

    protected collidedWith(object: Entity): void {
        super.collidedWith(object);
        switch (object.entityType) {
            case 'HardWall':
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
            case 'SmallWall':
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this.checkCollisions(SceneManager.currentScene.children as Entity[]);
    }

    public setSkin(options?: SkinOptions): void {
        super.setSkin(options);
        this.width = TILE_SIZE - 2;
        this.height = TILE_SIZE - 2;
    }

}

export { Tank }
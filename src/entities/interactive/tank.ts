import {Entity} from "../entity";
import {Point} from "pixi.js";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {SceneManager} from "../../scene-manager";
import {BulletWeaponComponent} from "../behaviors/weapon/bullet-weapon-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";
import {AppearFX} from "../fx/appear";
import { Vars } from "../../vars";

class Tank extends Entity {
    protected _speed: number;

    constructor(source?: Tank) {
        super(source);
        this._speed = source?._speed || 2;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BulletWeaponComponent());
        this.getComponent(AbstractWeaponComponent).setReloadTime(50);
    }

    public clone(): Tank {
        return new Tank(this);
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
        if (object == this) return;
        switch (object.entityType) {
            case Vars.GameObjects.HARD_WALL:
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
            case Vars.GameObjects.HARD_WALL:
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
            case Vars.GameObjects.WATER:
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
            case Vars.GameObjects.TANK:
                this.getComponent(AbstractMovementComponent).stop();
                this.getComponent(AbstractMovementComponent).resetPosition();
                break;
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
        this.checkCollisions(SceneManager.currentScene.children as Entity[]);
    }

}

export { Tank }
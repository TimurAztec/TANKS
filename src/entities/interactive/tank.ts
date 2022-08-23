import {Entity} from "../entity";
import {AnimatedSprite, Point} from "pixi.js";
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
import {getTitlePosition, validatePointIsPositive} from "../../utils/utils";
import {BigExplosionFX} from "../fx/big-explosion";
import {Scene} from "../../scenes/scene";
import { Vars } from "../../vars";
import { AbstractBuffComponent } from "../behaviors/buffs/abstract-buff-component";
import { Buff } from "./buff";

class Tank extends Entity {
    protected _speed: number;
    protected _health: number;

    constructor(source?: Tank) {
        super(source);
        this._speed = source?._speed || 2;
        this._health = source?._health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BulletWeaponComponent());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case 'HardWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'SmallWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Water':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Tank':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Buff':
                    this.setComponent((object as Buff).getBuff());
                    (object as Buff).destroy();
            }
        }));
        this.getComponent(AbstractWeaponComponent).setReloadTime(50);
    }

    public set speed(value: number) {
        this._speed = value;
    } 

    public clone(): Tank {
        return new Tank(this);
    }

    public takeDamage(damage: number): void {
        this._health -= damage;
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (this.getComponent(AbstractMovementComponent) && this.getComponent(AbstractCollisionComponent) && this._initOnUpdate) {
            this.getComponent(AbstractMovementComponent).onEntityMoved((vector: Point) => {

                (this._skin as AnimatedSprite).loop = false;
                if (!(this._skin as AnimatedSprite).playing) {
                    (this._skin as AnimatedSprite).gotoAndPlay(0);
                }

                const tileMap = (SceneManager.currentScene as GameScene).tileMap;
                const tilePos = this.tilePosition;
                const nextTilePos = this.getNextTilePosition(vector);
                if (!tileMap || !validatePointIsPositive(tilePos) || !validatePointIsPositive(nextTilePos)) return;
                let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
                if (tileMap[nextTilePos.y] && tileMap[nextTilePos.y][nextTilePos.x]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y][nextTilePos.x]]
                }
                if (nextTilePos.y != 0 && tileMap[nextTilePos.y] && tileMap[nextTilePos.y][nextTilePos.x - 1]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y][nextTilePos.x - 1]]
                }
                if (nextTilePos.y != 0 && tileMap[nextTilePos.y] && tileMap[nextTilePos.y][nextTilePos.x + 1]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y][nextTilePos.x + 1]]
                }
                if (nextTilePos.x != 0 && tileMap[nextTilePos.y + 1]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y + 1][nextTilePos.x]]
                }
                if (nextTilePos.x != 0 && tileMap[nextTilePos.y - 1]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y - 1][nextTilePos.x]]
                }
                this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
            });
        }

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

    public update(dt: number): void {
        if (this._health <= 0) {
            const fx = new BigExplosionFX();
            fx.x = this.x;
            fx.y = this.y;
            SceneManager.currentScene.addChild(fx);
            this.destroy();
        }
        if (this._initOnUpdate) {
            const fx = new AppearFX();
            fx.x = this.x;
            fx.y = this.y;
            SceneManager.currentScene.addChild(fx);
        }
        super.update(dt);
    }
}

export { Tank }
import {Entity} from "../entity";
import {AnimatedSprite, Point} from "pixi.js";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {SceneManager} from "../../scene-manager";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";
import {AppearFX} from "../fx/appear";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import {AbstractCollisionComponent} from "../behaviors/collision/abstract-collision-component";
import {getTitlePosition, validatePointIsPositive} from "../../utils/utils";
import {BigExplosionFX} from "../fx/big-explosion";
import { Buff } from "./buff";
import { Tank } from "./tank";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import {ImmortalBuffComponent} from "../behaviors/buffs/immortal-buff-component";
import { Soldier } from "./soldier";

class Tractor extends Entity {
    public speed: number;
    public health: number;
    public immortal: boolean;

    constructor(source?: Tractor) {
        super(source);
        this.speed = source?.speed || 3;
        this.health = source?.health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case 'HardWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'SmallWall':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Tank':
                    this.getComponent(AbstractMovementComponent).collides();
                    if (this.getComponent(AbstractTeamComponent).getTeam() == object.getComponent(AbstractTeamComponent).getTeam()) break;
                    (object as Tank).takeDamage(1);
                    break;
                case 'DeadTank':
                    this.getComponent(AbstractMovementComponent).collides();
                    break;
                case 'Tractor':
                    this.getComponent(AbstractMovementComponent).collides();
                    if (this.getComponent(AbstractTeamComponent).getTeam() == object.getComponent(AbstractTeamComponent).getTeam()) break;
                    (object as Tank).takeDamage(1);
                    break;
                case 'Soldier':
                    (object as Soldier).takeDamage(9999);
                    break;
                case 'Buff':
                    this.setComponent((object as Buff).getBuff());
                    (object as Buff).destroy();
            }
        }));
    }

    public clone(): Tractor {
        return new Tractor(this);
    }

    public takeDamage(damage: number): void {
        if (this.immortal) return;
        this.health -= damage;
        this.setComponent(new ImmortalBuffComponent().applyBuff(60));
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (this.getComponent(AbstractMovementComponent) && this.getComponent(AbstractCollisionComponent) && this._initOnUpdate) {
            this.getComponent(AbstractMovementComponent).onEntityMoved((vector: Point) => {

                (this._skin as AnimatedSprite).loop = false;
                if (!(this._skin as AnimatedSprite).playing) {
                    (this._skin as AnimatedSprite).gotoAndPlay(0);
                }

            });
        }

        if (Object.getPrototypeOf(component) instanceof AbstractControlComponent) {
            this.getComponent(AbstractControlComponent).onActionUp(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, -this.speed));
            });
            this.getComponent(AbstractControlComponent).onActionDown(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, this.speed));
            });
            this.getComponent(AbstractControlComponent).onActionRight(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(this.speed, 0));
            });
            this.getComponent(AbstractControlComponent).onActionLeft(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(-this.speed, 0));
            });
            this.getComponent(AbstractControlComponent).onActionSpace(() => {
                if (this.getComponent(AbstractWeaponComponent)) this.getComponent(AbstractWeaponComponent).fire();
            });
        }

    }

    public updateTilingData(tileMap: any[][], tileSize: number): void {
        const tilePos = getTitlePosition(this.position, tileSize);
        const vectorTilePos = getTitlePosition(this.getComponent(AbstractMovementComponent).rotationVector, tileSize);
        if (!tileMap || !validatePointIsPositive(tilePos) || !validatePointIsPositive(vectorTilePos)) return;
        let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        if (tileMap[tilePos.y] && tileMap[tilePos.y][tilePos.x - 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[tilePos.y][tilePos.x - 1]]
        }
        if (tileMap[tilePos.y] && tileMap[tilePos.y][tilePos.x + 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[tilePos.y][tilePos.x + 1]]
        }
        if (tileMap[tilePos.y + 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[tilePos.y + 1][tilePos.x]]
        }
        if (tileMap[tilePos.y - 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[tilePos.y - 1][tilePos.x]]
        }
        if (tileMap[vectorTilePos.y] && tileMap[vectorTilePos.y][vectorTilePos.x]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y][vectorTilePos.x]]
        }
        if (tileMap[vectorTilePos.y] && tileMap[vectorTilePos.y][vectorTilePos.x - 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y][vectorTilePos.x - 1]]
        }
        if (tileMap[vectorTilePos.y] && tileMap[vectorTilePos.y][vectorTilePos.x + 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y][vectorTilePos.x + 1]]
        }
        if (tileMap[vectorTilePos.y + 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y + 1][vectorTilePos.x]]
        }
        if (tileMap[vectorTilePos.y - 1]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y - 1][vectorTilePos.x]]
        }
        this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
    }

    public update(dt: number): void {
        if (this.health <= 0) {
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

export { Tractor }
import {Entity} from "../entity";
import {Point} from "pixi.js";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import {AbstractCollisionComponent} from "../behaviors/collision/abstract-collision-component";
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { DeadSoldier } from "../tiles/dead-soldier";
import {getTitlePosition, validatePointIsPositive} from "../../../../utils/utils";
import { SceneManager } from "../../../../scene-manager";
import { GameConstants } from "../../game-constants";

class Soldier extends Entity {
    public speed: number;
    public health: number;
    public immortal: boolean;

    constructor(source?: Soldier) {
        super(source);
        this.speed = source?.speed || 0.5;
        this.health = source?.health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            const stopObject: string[] = [
                GameConstants.EntityTypes.HARD_WALL,
                GameConstants.EntityTypes.SMALL_WALL,
                GameConstants.EntityTypes.TANK,
                GameConstants.EntityTypes.TRACTOR
            ];
            if (stopObject.includes(object.entityType)) { this.getComponent(AbstractMovementComponent).collides(); }
        }));
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

                this._skin.loop = false;
                if (!this._skin.playing) {
                    this._skin.gotoAndPlay(1);
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
            const dead = new DeadSoldier();
            dead.x = this.x;
            dead.y = this.y;
            SceneManager.currentScene.addChild(dead);
            this.destroy();
        }
        super.update(dt);
        if (this.destroyed) return;
        if (!this._skin.playing) {
            this._skin.gotoAndStop(0);
        }
        const scaleX = Math.abs(this._skin.scale.x);
        if (this.angle == 90) {
            this._skin.scale.x = scaleX;
        }
        if (this.angle == 270) {
            this._skin.scale.x = -scaleX;
        }
        this._skin.angle = -this.angle;
    }
}

export { Soldier }
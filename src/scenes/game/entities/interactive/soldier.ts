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
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";

class Soldier extends Entity {
    public speed: number;
    public health: number;
    public immortal: boolean;

    constructor(source?: Soldier) {
        super(source);
        this.speed = source?.speed || 0.5;
        this.health = source?.health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent()
            .onCollidedWith(GameConstants.EntityTypes.HARD_WALL, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.SMALL_WALL, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.TANK, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.takeDamage(9999);
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.TRACTOR, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.takeDamage(9999);
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.BULLET, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.takeDamage(9999);
                }
            }))

        );
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
        const collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        const collisionGroupAdditionalTilesRelativePositions = [
            new Point(vectorTilePos.x,vectorTilePos.y),
            new Point(vectorTilePos.x - 1,vectorTilePos.y),
            new Point(vectorTilePos.x + 1,vectorTilePos.y),
            new Point(vectorTilePos.x,vectorTilePos.y - 1),
            new Point(vectorTilePos.x,vectorTilePos.y + 1),
        ]
        for (const additionalTilePos of collisionGroupAdditionalTilesRelativePositions) {
            if (tileMap[additionalTilePos.y] && tileMap[additionalTilePos.y][additionalTilePos.x]) {
                collisionGroup.push(...tileMap[additionalTilePos.y][additionalTilePos.x]);
            }
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
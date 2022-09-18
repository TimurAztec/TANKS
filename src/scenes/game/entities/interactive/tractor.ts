import {Entity} from "../entity";
import {AnimatedSprite, Loader, Point} from "pixi.js";
import {DirectionalWalkMovementBehavior} from "../behaviors/movement/direct-walk-movement-component";
import {AbstractWeaponComponent} from "../behaviors/weapon/abstract-weapon-component";
import {IComponent} from "../behaviors/IComponent";
import {AbstractControlComponent} from "../behaviors/control/abstract-control-component";
import { AbstractMovementComponent } from "../behaviors/movement/abstract-movement-component";
import {AppearFX} from "../fx/appear";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import {AbstractCollisionComponent} from "../behaviors/collision/abstract-collision-component";
import {BigExplosionFX} from "../fx/big-explosion";
import { Buff } from "./buff";
import { Tank } from "./tank";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import {ImmortalBuffComponent} from "../behaviors/buffs/immortal-buff-component";
import { Soldier } from "./soldier";
import { Howl } from "howler";
import { Constants } from "../../../../constants";
import { getTitlePosition, validatePointIsPositive } from "../../../../utils/utils";
import { SceneManager } from "../../../../scene-manager";
import { GameConstants } from "../../game-constants";

class Tractor extends Entity {
    public speed: number;
    public health: number;
    public immortal: boolean;
    protected _moveSound: Howl = new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.HEAVY_TRANSPORT_MOVE].url, volume: 0.25});

    constructor(source?: Tractor) {
        super(source);
        this.speed = source?.speed || 3;
        this.health = source?.health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent()
            .onCollidedWith(GameConstants.EntityTypes.HARD_WALL, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.SMALL_WALL, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.AT_HEDGEHOGS, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.DEAD_TANK, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.TRACTOR, () => {this.getComponent(AbstractMovementComponent).collides()})
            .onCollidedWith(GameConstants.EntityTypes.SOLDIER, ((object: Entity) => {(object as Soldier).takeDamage(9999)}))
            .onCollidedWith(GameConstants.EntityTypes.TANK, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    (object as Tank).takeDamage(1);
                    this.getComponent(AbstractMovementComponent).collides();
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.TRACTOR, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    (object as Tractor).takeDamage(1);
                    this.getComponent(AbstractMovementComponent).collides();
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.BULLET, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.takeDamage(1);
                    object.destroy();
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.BUFF, ((object: Entity) => {
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.BONUS].url}).play();
                this.setComponent((object as Buff).getBuff());
                (object as Buff).destroy();
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
                this._skin.onComplete = () => {
                    this._moveSound.pause();
                }
                if (!this._skin.playing) {
                    this._skin.gotoAndPlay(0);
                    this._moveSound.play();
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
            new Point(tilePos.x-1,tilePos.y),
            new Point(tilePos.x+1,tilePos.y),
            new Point(tilePos.x,tilePos.y-1),
            new Point(tilePos.x,tilePos.y+1),
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
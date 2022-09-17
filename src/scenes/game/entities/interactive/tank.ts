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
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { Soldier } from "./soldier";
import { RandomControlComponent } from "../behaviors/control/random-control-component";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import { BasicTeamComponent } from "../behaviors/team/basic-team-component";
import { DeadTank } from "../tiles/dead-tank";
import { Howl } from "howler";
import {getTitlePosition, randNum, validatePointIsPositive} from "../../../../utils/utils";
import { SceneManager } from "../../../../scene-manager";
import {Constants} from "../../../../constants";
import { GameConstants } from "../../game-constants";

class Tank extends Entity {
    public speed: number;
    public health: number;
    public immortal: boolean;
    protected _moveSound: Howl = new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.HEAVY_TRANSPORT_MOVE].url, volume: 0.25});

    constructor(source?: Tank) {
        super(source);
        this.speed = source?.speed || 2;
        this.health = source?.health || 1;
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            const stopObject: string[] = [
                GameConstants.EntityTypes.HARD_WALL,
                GameConstants.EntityTypes.SMALL_WALL,
                GameConstants.EntityTypes.AT_HEDGEHOGS,
                GameConstants.EntityTypes.TANK,
                GameConstants.EntityTypes.DEAD_TANK,
                GameConstants.EntityTypes.TRACTOR
            ];
            if (stopObject.includes(object.entityType)) { this.getComponent(AbstractMovementComponent).collides(); }
            switch (object.entityType) {
                case GameConstants.EntityTypes.SOLDIER:
                    (object as Soldier).takeDamage(9999);
                    break;
                case GameConstants.EntityTypes.BUFF:
                    new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.BONUS].url}).play();
                    this.setComponent((object as Buff).getBuff());
                    (object as Buff).destroy();
            }
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
            const dead = new DeadTank();
            dead.x = this.x;
            dead.y = this.y;
            dead.angle = this.angle;
            SceneManager.currentScene.addChild(dead);
            let i: number = Math.floor(randNum(3));
            while(i--) {
                const soldier = new Soldier();
                soldier.setSkin({assetName: Constants.AssetsTextures.SOLIDER, numberOfFrames: 13, scaleX: 0.75, scaleY: 0.5, animationSpeed: 0.5});
                soldier.setComponent(new RandomControlComponent());
                soldier.setComponent(new BasicTeamComponent().setTeam(this.getComponent(AbstractTeamComponent).getTeam()));
                soldier.x = this.x;
                soldier.y = this.y;
                SceneManager.currentScene.addChild(soldier);
            }
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
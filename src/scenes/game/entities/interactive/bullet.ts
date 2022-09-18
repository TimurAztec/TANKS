import {Entity} from "../entity";
import {Loader, Point} from "pixi.js";
import {ProjectileMovementComponent} from "../behaviors/movement/projectile-movement-component";
import {AbstractMovementComponent} from "../behaviors/movement/abstract-movement-component";
import {SmallExplosionFX} from "../fx/small-explosion";
import {BigExplosionFX} from "../fx/big-explosion";
import {BasicTeamComponent} from "../behaviors/team/basic-team-component";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import { AbstractCollisionComponent } from "../behaviors/collision/abstract-collision-component";
import { Tank } from "./tank";
import { Soldier } from "./soldier";
import { DeadTank } from "../tiles/dead-tank";
import { Howl } from "howler";
import {getTitlePosition, validatePointIsPositive} from "../../../../utils/utils";
import { SceneManager } from "../../../../scene-manager";
import { Constants } from "../../../../constants";
import { GameConstants } from "../../game-constants";
import { Tractor } from "./tractor";

class Bullet extends Entity {
    protected _speed: number = 6;
    protected _dttimer: number = 0;

    constructor(source?: Bullet) {
        super(source);
        this._speed = source?._speed || 6;
        this.setComponent(new BasicTeamComponent());
        this.setComponent(new BasicAabbCollisionComponent()
            .onCollidedWith(GameConstants.EntityTypes.HARD_WALL, ((object: Entity) => {
                this.explode(new SmallExplosionFX());
            }))
            .onCollidedWith(GameConstants.EntityTypes.SMALL_WALL, ((object: Entity) => {
                this.explode(new SmallExplosionFX());
                object.destroy();
            }))
            .onCollidedWith(GameConstants.EntityTypes.TANK, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.destroy();
                    (object as Tank).takeDamage(1);
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.DEAD_TANK, ((object: Entity) => {
                this.destroy();
                (object as Tank).takeDamage(1);
            }))
            .onCollidedWith(GameConstants.EntityTypes.TRACTOR, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.destroy();
                    (object as Tractor).takeDamage(1);
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.SOLDIER, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.explode(new SmallExplosionFX());
                    (object as Soldier).takeDamage(9999);
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.BULLET, ((object: Entity) => {
                if (!this.getComponent(AbstractTeamComponent).checkTeam(object.getComponent(AbstractTeamComponent))) {
                    this.explode(new SmallExplosionFX());
                    object.destroy();
                }
            }))
            .onCollidedWith(GameConstants.EntityTypes.BULLET, ((object: Entity) => {
                this.explode(new BigExplosionFX());
                object.destroy();
            }))
        );
        this.setComponent(new ProjectileMovementComponent());
    }

    public launch(angle: number): void {
        new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.SHOT].url}).play();
        const radAngle: number = (angle-90) * (Math.PI/180);
        this.getComponent(AbstractMovementComponent).setMovementVector(
            new Point(Math.cos(radAngle) * this._speed,
                Math.sin(radAngle) * this._speed));
    }

    protected explode(fx: Entity): void {
        fx.x = this.x;
        fx.y = this.y;
        SceneManager.currentScene.addChild(fx);
        this.destroy();
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
        super.update(dt);
        this._dttimer += dt;
        if (this._dttimer > 1000) this.destroy();
    }

}

export { Bullet }
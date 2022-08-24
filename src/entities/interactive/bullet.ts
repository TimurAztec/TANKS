import {Entity} from "../entity";
import {Point} from "pixi.js";
import {ProjectileMovementComponent} from "../behaviors/movement/projectile-movement-component";
import {SceneManager} from "../../scene-manager";
import {AbstractMovementComponent} from "../behaviors/movement/abstract-movement-component";
import {SmallExplosionFX} from "../fx/small-explosion";
import {BigExplosionFX} from "../fx/big-explosion";
import {BasicTeamComponent} from "../behaviors/team/basic-team-component";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import {BasicAabbCollisionComponent} from "../behaviors/collision/basic-aabb-collision-component";
import { AbstractCollisionComponent } from "../behaviors/collision/abstract-collision-component";
import { Tank } from "./tank";
import { Vars } from "../../vars";
import { getTitlePosition, validatePointIsPositive } from "../../utils/utils";

class Bullet extends Entity {
    protected _speed: number = 6;
    protected _dttimer: number = 0;

    constructor(source?: Bullet) {
        super(source);
        this._speed = source?._speed || 6;
        this.setComponent(new BasicTeamComponent());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case Vars.GameObjects.HARD_WALL:
                    this.explode(new SmallExplosionFX());
                    break;
                case Vars.GameObjects.SMALL_WALL:
                    this.explode(new SmallExplosionFX());
                    object.destroy();
                    break;
                case Vars.GameObjects.TANK:
                    if (this.getComponent(AbstractTeamComponent).getTeam() == object.getComponent(AbstractTeamComponent).getTeam()) break;
                    this.destroy();
                    (object as Tank).takeDamage(1);
                    break;
                case 'Bullet':
                    if (this.getComponent(AbstractTeamComponent).getTeam() == object.getComponent(AbstractTeamComponent).getTeam()) break;
                    this.explode(new SmallExplosionFX());
                    object.destroy();
                    break;
                case 'Base':
                    this.explode(new BigExplosionFX());
                    object.destroy();
                    break;
            }
        }));
        this.setComponent(new ProjectileMovementComponent());
    }

    public clone(): Bullet {
        return new Bullet(this);
    }

    public launch(angle: number): void {
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
        let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        if (tileMap[vectorTilePos.y] && tileMap[vectorTilePos.y][vectorTilePos.x]) {
            collisionGroup = [...collisionGroup, ...tileMap[vectorTilePos.y][vectorTilePos.x]]
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
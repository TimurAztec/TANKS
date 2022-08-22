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
import {IComponent} from "../behaviors/IComponent";
import { AbstractCollisionComponent } from "../behaviors/collision/abstract-collision-component";
import {GameScene} from "../../scenes/game/game-scene";
import { Tank } from "./tank";
import { Vars } from "../../vars";

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

    public update(dt: number): void {
        super.update(dt);
        this._dttimer += dt;
        if (this._dttimer > 1000) this.destroy();
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (this.getComponent(AbstractMovementComponent) && this.getComponent(AbstractCollisionComponent) && this._initOnUpdate) {
            this.getComponent(AbstractMovementComponent).onEntityMoved((vector: Point) => {
                const tileMap = (SceneManager.currentScene as GameScene).tileMap;
                const tilePos = this.tilePosition;
                const nextTilePos = this.getNextTilePosition(vector);
                if (!tileMap) return;
                let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
                if (tileMap[nextTilePos.y] && tileMap[nextTilePos.y][nextTilePos.x]) {
                    collisionGroup = [...collisionGroup, ...tileMap[nextTilePos.y][nextTilePos.x]]
                }
                this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
            });
        }
    }

}

export { Bullet }
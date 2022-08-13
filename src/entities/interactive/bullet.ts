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

class Bullet extends Entity {
    protected _speed: number = 6;

    constructor(source?: Bullet) {
        super(source);
        this._speed = source?._speed || 6;
        this.setComponent(new ProjectileMovementComponent());
        this.setComponent(new BasicTeamComponent());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case 'HardWall':
                    this.explode(new SmallExplosionFX());
                    break;
                case 'SmallWall':
                    this.explode(new SmallExplosionFX());
                    object.destroy();
                    break;
                case 'Tank':
                    if (this.getComponent(AbstractTeamComponent).getTeam() == object.getComponent(AbstractTeamComponent).getTeam()) break;
                    this.explode(new BigExplosionFX());
                    object.destroy();
                    break;
            }
        }));
    }

    public clone(): Bullet {
        return new Bullet(this);
    }

    public launch(angle: number): void {
        let radAngle: number = (angle-90) * (Math.PI/180);
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

}

export { Bullet }
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

        if (Object.getPrototypeOf(component) instanceof AbstractMovementComponent) {
            this.getComponent(AbstractMovementComponent).onEntityMoved(() => {
                if (this.getComponent(AbstractCollisionComponent))
                    this.getComponent(AbstractCollisionComponent).setCollisionGroup(SceneManager.currentScene.children as Entity[])
            })
        }
    }

}

export { Bullet }
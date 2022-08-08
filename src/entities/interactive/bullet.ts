import {Entity} from "../entity";
import {Point} from "pixi.js";
import {ProjectileMovementComponent} from "../behaviors/movement/projectile-movement-component";
import {SceneManager} from "../../scene-manager";
import {AbstractMovementComponent} from "../behaviors/movement/abstract-movement-component";
import {SmallExplosionFX} from "../fx/small-explosion";

class Bullet extends Entity {
    protected _speed: number = 6;

    constructor() {
        super();
        this.setComponent(new ProjectileMovementComponent());
    }

    public launch(angle: number): void {
        let radAngle: number = (angle-90) * (Math.PI/180);
        this.getComponent(AbstractMovementComponent).setMovementVector(
            new Point(Math.cos(radAngle) * this._speed,
                Math.sin(radAngle) * this._speed));
    }

    protected collidedWith(object: Entity): void {
        super.collidedWith(object);
        switch (object.entityType) {
            case 'HardWall':
                this.explode();
                break;
            case 'SmallWall':
                this.explode();
                object.destroy();
                break;
        }
    }

    protected explode(): void {
        const fx = new SmallExplosionFX();
        fx.x = this.x;
        fx.y = this.y;
        SceneManager.currentScene.addChild(fx);
        this.destroy();
    }

    public update(dt: number): void {
        super.update(dt);
        this.checkCollisions(SceneManager.currentScene.children as Entity[]);
    }

}

export { Bullet }
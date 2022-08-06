import {Entity} from "../entity";
import {Point} from "pixi.js";
import {IControlBehavior} from "../behaviors/control/IControlBehavior";
import {TILE_SIZE} from "../tiles/tiles-factory";
import {SkinOptions} from "../interfaces";
import {MovingEntity} from "../moving-entity";

class Tank extends MovingEntity {
    protected _speed: number = 4;

    public set controlBehavior(value: IControlBehavior) {
        super.controlBehavior = value;
        this._controlBehavior.onActionUp(() => {
            this._moveVector.x = 0;
            this._moveVector.y = -this._speed;
            this._rotateTo = 0;
        });
        this._controlBehavior.onActionDown(() => {
            this._moveVector.x = 0;
            this._moveVector.y = this._speed;
            this._rotateTo = 180;
        });
        this._controlBehavior.onActionRight(() => {
            this._moveVector.x = this._speed;
            this._moveVector.y = 0;
            this._rotateTo = 90;
        });
        this._controlBehavior.onActionLeft(() => {
            this._moveVector.x = -this._speed;
            this._moveVector.y = 0;
            this._rotateTo = 270;
        });
    }

    protected collidedWith(object: Entity): void {
        super.collidedWith(object);
        switch (object.entityType) {
            case 'HardWall':
                this._moveVector = new Point();
                this.position.copyFrom(this._previousPosition);
                break;
            case 'SmallWall':
                this._moveVector = new Point();
                this.position.copyFrom(this._previousPosition);
                break;
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this._moveVector = new Point();
        this.checkCollisions(this.parent.children as Entity[]);
    }

    public setSkin(options?: SkinOptions): void {
        super.setSkin(options);
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
    }

}

export { Tank }
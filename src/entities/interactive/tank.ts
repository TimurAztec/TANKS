import {Entity} from "../entity";
import {Loader, Point, Sprite} from "pixi.js";
import {IControlBehavior} from "../behaviors/control/IControlBehavior";
import {TILE_SIZE} from "../tiles/tiles-factory";

class Tank extends Entity {
    protected _controlBehavior: IControlBehavior;
    protected _speed: number = 4;
    protected _moveVector: Point = new Point(0, 0);
    protected _angle: number = 0;

    public set controlBehavior(value: IControlBehavior) {
        this._controlBehavior = value;
        this._controlBehavior.onActionUp(() => {
            this._moveVector.x = 0;
            this._moveVector.y = -this._speed;
            this._angle = 0;
        });
        this._controlBehavior.onActionDown(() => {
            this._moveVector.x = 0;
            this._moveVector.y = this._speed;
            this._angle = 180;
        });
        this._controlBehavior.onActionRight(() => {
            this._moveVector.x = this._speed;
            this._moveVector.y = 0;
            this._angle = 90;
        });
        this._controlBehavior.onActionLeft(() => {
            this._moveVector.x = -this._speed;
            this._moveVector.y = 0;
            this._angle = 270;
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
                // object.destroy();
                break;
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this.x += this._moveVector.x;
        this.y += this._moveVector.y;
        this.angle = this._angle;
        this._moveVector = new Point();
        this.checkCollisions(this.parent.children as Entity[]);
    }

}

export { Tank }
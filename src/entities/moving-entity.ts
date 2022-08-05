import {Point} from "pixi.js";
import {IEntity} from "./interfaces";
import { Entity } from "./entity";

abstract class MovingEntity extends Entity implements IEntity {

    protected _previousPosition: Point = new Point();
    protected _moveVector: Point = new Point();
    protected _speed: number = 0;
    protected _rotateTo: number = 0;

    public checkCollisionWith(object: Entity): boolean {
        return (this.x - this.width/2 < object.x + object.width/2 &&
            this.x + this.width/2 > object.x - object.width/2 &&
            this.y - this.height/2 < object.y + object.height/2 &&
            this.y + this.height/2 > object.y - object.height/2)
    }

    public checkCollisions(objects: Entity[]): void {
        for (let obj of objects) {
            if (this.checkCollisionWith(obj)) {
                this.collidedWith(obj);
            }
        }
    }

    protected collidedWith(object: Entity): void {}

    public update(dt: number): void {
        super.update(dt);
        this._previousPosition.copyFrom(this.position);
        this.x += this._moveVector.x;
        this.y += this._moveVector.y;
        this.angle = this._rotateTo;
    }
}

export {MovingEntity}
import {AnimatedSprite, Container, Point, Sprite} from "pixi.js";
import {IEntity} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';

abstract class Entity extends Container implements IEntity {

    protected _skin: Sprite | AnimatedSprite;
    protected _previousPosition: Point = new Point();

    public get entityType(): string {
        return this.constructor.name;
    }

    constructor() {
        super();
        this.name = this.constructor.name + uuidv4();
    }

    public setSkin(options?: any): void {
        this.addChild(this._skin);
        this.resetPivot();
    }

    protected resetPivot(): void {
        this.pivot.set(this.x + this.width/2, this.y + this.height/2);
    }

    public checkCollisionWith(object: Entity): boolean {
        return (this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.height + this.y > object.y)
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
        this._previousPosition.copyFrom(this.position);
    }
}

export {Entity}
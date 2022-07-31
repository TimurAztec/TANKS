import {AnimatedSprite, Container, Sprite} from "pixi.js";
import {IEntity} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';

class Entity extends Container implements IEntity {

    protected skin: Sprite | AnimatedSprite;

    constructor() {
        super();
        this.name = this.constructor.name + uuidv4();
    }

    public setSkin(options?: any): void {
        this.addChild(this.skin);
        this.resetPivot();
    }

    protected resetPivot(): void {
        this.pivot.set(this.x + this.width/2, this.y + this.height/2);
    }

    public collidesWith(object: Container): boolean {
        return (this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.height + this.y > object.y)
    }
}

export {Entity}
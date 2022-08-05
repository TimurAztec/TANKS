import {AnimatedSprite, Container, Loader, Sprite} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';

abstract class Entity extends Container implements IEntity {

    protected _skin: Sprite | AnimatedSprite;

    public get entityType(): string {
        return this.constructor.name;
    }

    constructor() {
        super();
        this.name = this.constructor.name + uuidv4();
    }

    public setSkin(options?: SkinOptions): void {
        if (options?.assetName) {
            this._skin = new Sprite(Loader.shared.resources[options.assetName].texture);
            this.addChild(this._skin);
        }
        this._skin._width = options?.width || this._skin.width;
        this._skin._height = options?.width || this._skin.height;
        this.resetPivot();
    }

    protected resetPivot(): void {
        this.pivot.set(this.x + this.width/2, this.y + this.height/2);
    }

    public update(dt: number): void {}
}

export {Entity}
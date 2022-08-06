import {AnimatedSprite, Container, Loader, Sprite} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';
import {IControlBehavior} from "./behaviors/control/IControlBehavior";
import {IMovementBehavior} from "./behaviors/movement/IMovementBehavior";

abstract class Entity extends Container implements IEntity {

    protected _skin: Sprite | AnimatedSprite;
    protected _controlBehavior: IControlBehavior;
    protected _movementBehavior: IMovementBehavior;

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

    public set controlBehavior(value: IControlBehavior) {
        this._controlBehavior = value;
        this._controlBehavior.setEntity(this);
    }

    public set movementBehavior(value: IMovementBehavior) {
        this._movementBehavior = value;
        this._movementBehavior.setEntity(this);
    }
}

export {Entity}
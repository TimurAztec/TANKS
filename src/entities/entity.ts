import {AnimatedSprite, BaseTexture, Container, Loader, Rectangle, Sprite, Texture} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';
import {IComponent} from "./behaviors/IComponent";
import {constr} from "../utils/utils";

abstract class Entity extends Container implements IEntity {

    protected _skin: (Sprite | AnimatedSprite);
    protected _components: IComponent[] = [];

    public get entityType(): string {
        return this.constructor.name;
    }

    constructor() {
        super();
        this.name = this.constructor.name + uuidv4();
    }

    public setSkin(options?: SkinOptions): void {
        if (options?.assetName) {
            if (!options.numberOfFrames) {
                this._skin = new Sprite(Loader.shared.resources[options.assetName].texture);
            }
            if (options.numberOfFrames) {
                const sheet = new BaseTexture(Loader.shared.resources[options.assetName].url);
                const frameWidth = sheet.width/options.numberOfFrames;
                const frameHeight = sheet.height;
                const frames: Texture[] = [];
                for (let i = 0 ; i < options.numberOfFrames ; i++) {
                    frames.push(new Texture(sheet, new Rectangle(i * frameWidth, 0, frameWidth, frameHeight)));
                }
                this._skin = new AnimatedSprite(frames, false);
            }
            this.addChild(this._skin);
        }
        this._skin._width = options?.width || this._skin.width;
        this._skin._height = options?.width || this._skin.height;
        this.resetPivot();
    }

    protected resetPivot(): void {
        this.pivot.set(this.x + this.width/2, this.y + this.height/2);
    }

    public update(dt: number): void {
        this._components.forEach((component) => component.update(dt));
    }

    public checkCollisionWith(object: Entity): boolean {
        try {
            return (this.x - this.width / 2 < object.x + object.width / 2 &&
                this.x + this.width / 2 > object.x - object.width / 2 &&
                this.y - this.height / 2 < object.y + object.height / 2 &&
                this.y + this.height / 2 > object.y - object.height / 2)
        } catch (e) {
            return false;
        }
    }

    public checkCollisions(objects: Entity[]): void {
        for (let obj of objects) {
            if (this.checkCollisionWith(obj)) {
                this.collidedWith(obj);
            }
        }
    }

    protected collidedWith(object: Entity): void {
        if (object == this) return;
    }

    public setComponent(component: IComponent): void {
        component.setEntity(this);
        for (const [i, c] of this._components.entries()) {
            if (Object.getPrototypeOf(c).constructor == Object.getPrototypeOf(component).constructor) {
                this._components[i] = component;
                return;
            }
        }
        this._components.push(component)
    }

    protected getComponent<C extends IComponent>(componentType: constr<C>): C {
        for (const component of this._components) {
            if (Object.getPrototypeOf(component) instanceof componentType) {
                return component as C
            }
        }
        return undefined;
    }

    public removeComponent<C extends IComponent>(componentType: constr<C>): void {
        let toRemove: IComponent;
        let index: number;

        for (const [i, component] of this._components.entries()) {
            if (Object.getPrototypeOf(component) instanceof componentType) {
                toRemove = component
                index = i
                break
            }
        }

        if (toRemove && index) {
            toRemove.setEntity(null);
            this._components.splice(index, 1)
        }
    }

}

export {Entity}
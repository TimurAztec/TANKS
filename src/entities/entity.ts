import {AnimatedSprite, BaseTexture, Container, Loader, Rectangle, Sprite, Texture} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';
import {IComponent} from "./behaviors/IComponent";
import {constr} from "../utils/utils";

abstract class Entity extends Container implements IEntity {

    protected _skin: (Sprite | AnimatedSprite);
    protected _skinOptions: SkinOptions;
    protected _components: IComponent[] = [];
    protected _initOnUpdate: boolean = true;

    public get entityType(): string {
        return this.constructor.name;
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    constructor(source?: Entity) {
        super();
        if (source?._skinOptions) this.setSkin(source._skinOptions);
        if (source?._components) {
            source._components.forEach(component => this.setComponent(Object.create(component)));
        }

        this.name = this.constructor.name + uuidv4();
        if (this._skin) { this.addChild(this._skin); }
    }

    // Clones entity without PIXI properties
    public abstract clone(): Entity;

    public setSkin(options?: SkinOptions): void {
        this._skinOptions = options;
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
        this._skin.anchor.set(0.5);
        this._skin.scale.x = options?.scaleX || this._skin.scale.x;
        this._skin.scale.y = options?.scaleY || this._skin.scale.y;
    }

    public update(dt: number): void {
        if (this._initOnUpdate) {
            this._initOnUpdate = false;
        }
        this._components.forEach((component) => component.update(dt));
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

    public getComponent<C extends IComponent>(componentType: constr<C>): C {
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
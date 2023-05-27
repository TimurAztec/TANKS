import {AnimatedSprite, Container, IDestroyOptions, Loader, Rectangle, Texture, utils} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import {IComponent} from "./behaviors/IComponent";
import {AbstractDestroyComponent} from "./behaviors/destroy/abstract-destroy-component";
import {IEventListener} from "../../../utils/events/IEventListener";
import {AABBData, constr} from "../../../utils/utils";
import { Constants } from "../../../constants";

abstract class Entity extends Container implements IEntity, IEventListener {

    protected _skin: AnimatedSprite;
    protected _skinOptions: SkinOptions;
    protected _components: IComponent[] = [];
    protected _initOnUpdate: boolean = true;
    protected _hitboxWidth: number;
    protected _hitboxHeight: number;

    public get entityType(): string {
        return this.constructor.name;
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    // protected getNextTilePosition(movementVector?: Point): Point {
    //     const entityTilePos = this.tilePosition;
    //     let vector = movementVector;
    //     //TODO prototype code for advanced collision for fast moving objects (doesent work for now)
    //     // if (!vector || (vector.x == 0 && vector.y == 0)) {
    //     //     const radAngle: number = (this.angle-90) * (Math.PI/180);
    //     //     vector = new Point(
    //     //         (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)),
    //     //         (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle))
    //     //     );
    //     // }
    //     const radAngle: number = (this.angle-90) * (Math.PI/180);
    //     vector = new Point(
    //         (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)),
    //         (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle))
    //     );
    //     return new Point(
    //         entityTilePos.x + (vector.x >= 0 ? Math.ceil(vector.x / TILE_SIZE) : Math.floor(vector.x / TILE_SIZE)),
    //         entityTilePos.y + (vector.y >= 0 ? Math.ceil(vector.y / TILE_SIZE) : Math.floor(vector.y / TILE_SIZE))
    //     )
    // }

    public get simpleBounds(): AABBData {
        return this.destroyed ? {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        } : {
            x: this.x,
            y: this.y,
            width: this._hitboxWidth || this.width,
            height: this._hitboxHeight || this.height
        }
    }

    public updateTilingData(tileMap: any[][], tileSize: number): void {};

    constructor(source?: Entity) {
        super();
        this._initOnUpdate = true;
        if (source?._skinOptions) this.setSkin(source._skinOptions);
        if (source?._components) {
            source._components.forEach(component => this.setComponent(component.clone()));
        }

        this.name = this.constructor.name + utils.uid()
        if (this._skin) { this.addChild(this._skin); }
    }

    // Clones entity without PIXI properties
    public clone(): Entity {
        const cloned = this.constructor as new (value: Entity) => this;
        return new cloned(this);
    };

    public setSkin(options?: SkinOptions): void {
        this._skinOptions = options;
        if (!this._skin && !options?.assetName) {
            options.assetName = Constants.AssetsTextures.EMPTY_SPACE;
        }
        if (options?.assetName) {
            const numberOfFrames = options?.numberOfFrames || 1;
            const sheet = Loader.shared.resources[options.assetName].texture;
            const frameWidth = sheet.width / numberOfFrames;
            const frameHeight = sheet.height;
            const frames: Texture[] = [];
            for (let i = 0 ; i < numberOfFrames ; i++) {
                const frame = sheet.clone();
                frame.frame = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
                frame.updateUvs();
                frames.push(frame);
            }
            this._skin = new AnimatedSprite(frames);
            this.addChild(this._skin);
        }
        this._skin.anchor.set(0.5);
        this._skin.scale.x = options?.scaleX || this._skin.scale.x;
        this._skin.scale.y = options?.scaleY || this._skin.scale.y;
        if (options?.hitboxWidth) this._hitboxWidth = options.hitboxWidth;
        if (options?.hitboxHeight) this._hitboxHeight = options.hitboxHeight;
        if (options?.animationSpeed) this._skin.animationSpeed = options.animationSpeed
    }

    public update(dt: number): void {
        if (this.destroyed) return;
        if (this._initOnUpdate) {
            this._initOnUpdate = false;
        }
        this._components.forEach((component) => component.update(dt));
    }

    public setComponent(component: IComponent): void {
        component.setEntity(this);
        let componentExist = false;
        for (const [i, c] of this._components.entries()) {
            if (c.typeID ==  component.typeID) {
                this._components[i].remove();
                this._components[i] = component;
                componentExist = true;
                return;
            }
        }
        if (!componentExist) { this._components.push(component); }
    }

    public getComponent<C extends IComponent>(componentType: constr<C>): C {
        for (const component of this._components) {
            if (component instanceof componentType) {
                return component as C
            }
        }
        return undefined;
    }

    public removeComponent<C extends IComponent>(componentType: constr<C>): void {
        let toRemove: IComponent;
        let index: number;

        for (const [i, component] of this._components.entries()) {
            if (component instanceof componentType) {
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

    public onEvent(event: string, data: any) {}

    public destroy(_options?: IDestroyOptions | boolean): void {
        super.destroy(_options);
        if (this.getComponent(AbstractDestroyComponent)) {
            this.getComponent(AbstractDestroyComponent).destroy();
        }
    }

}

export {Entity}
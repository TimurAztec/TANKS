import {AnimatedSprite, Container, Loader, Point, Rectangle, Sprite, Texture, utils} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import {IComponent} from "./behaviors/IComponent";
import {AABBData, constr, getTitlePosition, validatePointIsPositive} from "../utils/utils";
import {AbstractMovementComponent} from "./behaviors/movement/abstract-movement-component";
import {IEventListener} from "../utils/events/IEventListener";
import {EventManager} from "../event-manager";
import {GameScene} from "../scenes/game/game-scene";
import {SceneManager} from "../scene-manager";
import {AbstractCollisionComponent} from "./behaviors/collision/abstract-collision-component";
import {TILE_SIZE} from "./entity-factory";

abstract class Entity extends Container implements IEntity, IEventListener {

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

    public get previousTilePosition(): Point {
        if (this.getComponent(AbstractMovementComponent)) {
            return getTitlePosition(new Point()
                .copyFrom(this.getComponent(AbstractMovementComponent).previousPosition));
        }
        return this.tilePosition;
    }

    public get tilePosition(): Point {
        return getTitlePosition(new Point().copyFrom(this.position));
    }

    protected getNextTilePosition(movementVector?: Point): Point {
        const entityTilePos = this.tilePosition;
        let vector = movementVector;
        //TODO prototype code for advanced collision for fast moving objects (doesent work for now)
        // if (!vector || (vector.x == 0 && vector.y == 0)) {
        //     const radAngle: number = (this.angle-90) * (Math.PI/180);
        //     vector = new Point(
        //         (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)),
        //         (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle))
        //     );
        // }
        const radAngle: number = (this.angle-90) * (Math.PI/180);
        vector = new Point(
            (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)),
            (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle))
        );
        return new Point(
            entityTilePos.x + (vector.x >= 0 ? Math.ceil(vector.x / TILE_SIZE) : Math.floor(vector.x / TILE_SIZE)),
            entityTilePos.y + (vector.y >= 0 ? Math.ceil(vector.y / TILE_SIZE) : Math.floor(vector.y / TILE_SIZE))
        )
    }

    public get simpleBounds(): AABBData {
        return this.destroyed ? {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        } : {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

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
    public abstract clone(): Entity;

    public setSkin(options?: SkinOptions): void {
        this._skinOptions = options;
        if (options?.assetName) {
            if (!options.numberOfFrames) {
                this._skin = new Sprite(Loader.shared.resources[options.assetName].texture);
            }
            if (options.numberOfFrames) {
                const sheet = Loader.shared.resources[options.assetName].texture;
                const frameWidth = sheet.width/options.numberOfFrames;
                const frameHeight = sheet.height;
                const frames: Texture[] = [];
                for (let i = 0 ; i < options.numberOfFrames ; i++) {
                    const frame = sheet.clone();
                    frame.frame = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
                    frame.updateUvs();
                    frames.push(frame);
                }
                this._skin = new AnimatedSprite(frames);
            }
            this.addChild(this._skin);
        }
        this._skin.anchor.set(0.5);
        this._skin.scale.x = options?.scaleX || this._skin.scale.x;
        this._skin.scale.y = options?.scaleY || this._skin.scale.y;
    }

    public update(dt: number): void {
        if (this.destroyed) return;
        if (this._initOnUpdate) {
            this._initOnUpdate = false;
        }
        this._components.forEach((component) => component.update(dt));
        if (!this._destroyed &&
            !this.previousTilePosition.equals(this.tilePosition) &&
            validatePointIsPositive(this.previousTilePosition) &&
            validatePointIsPositive(this.tilePosition)) {
            EventManager.notify('entity_moved_from_tile_to_tile', {
                entity: this,
                from: this.previousTilePosition,
                to: this.tilePosition
            });
        }
    }

    public setComponent(component: IComponent): void {
        component.setEntity(this);
        let componentExist = false;
        for (const [i, c] of this._components.entries()) {
            if (c.typeID ==  component.typeID) {
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

}

export {Entity}
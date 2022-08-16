import {AnimatedSprite, Container, Loader, Point, Rectangle, Sprite, Texture, utils} from "pixi.js";
import {IEntity, SkinOptions} from "./interfaces";
import {IComponent} from "./behaviors/IComponent";
import {AABBData, constr, getTitlePosition} from "../utils/utils";
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
    protected _previousTilePosition: Point = new Point();

    public get entityType(): string {
        return this.constructor.name;
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public get tilePosition(): Point {
        return getTitlePosition(new Point().copyFrom(this.position));
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
        if (source?._skinOptions) this.setSkin(source._skinOptions);
        if (source?._components) {
            source._components.forEach(component => this.setComponent(Object.create(component)));
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
                this._skin = new AnimatedSprite(frames, false);
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
    }

    public setComponent(component: IComponent): void {
        component.setEntity(this);
        for (const [i, c] of this._components.entries()) {
            if (Object.getPrototypeOf(c).constructor == Object.getPrototypeOf(component).constructor) {
                this._components[i] = component;
                return;
            }
        }
        this._components.push(component);

        if (this.getComponent(AbstractMovementComponent) && this.getComponent(AbstractCollisionComponent) && this._initOnUpdate) {
            this.getComponent(AbstractMovementComponent).onEntityMoved((vector: Point, prevPos: Point) => {
                this._previousTilePosition = getTitlePosition(new Point().copyFrom(prevPos));
                this.processTiling(vector);
            });
        }
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

    public onEvent(event: string, data: any) {}

    protected processTiling(movementVector?: Point): void {
        const tileMap = (SceneManager.currentScene as GameScene).tileMap;
        const entityTilePos = this.tilePosition;
        let vector = movementVector;
        if (vector.x == 0 && vector.y == 0) {
            const radAngle: number = (this.angle-90) * (Math.PI/180);
            vector = new Point(
                (Math.abs(Math.cos(radAngle)) != 1 ? 0 : Math.cos(radAngle)),
                (Math.abs(Math.sin(radAngle)) != 1 ? 0 : Math.sin(radAngle))
            );
        }
        const tileVectoredPos: Point = new Point(
            entityTilePos.x + (vector.x >= 0 ? Math.ceil(vector.x / TILE_SIZE) : Math.floor(vector.x / TILE_SIZE)),
            entityTilePos.y + (vector.y >= 0 ? Math.ceil(vector.y / TILE_SIZE) : Math.floor(vector.y / TILE_SIZE))
        )
        this.getComponent(AbstractCollisionComponent).setCollisionGroup([
            ...tileMap[entityTilePos.y][entityTilePos.x],
            ...tileMap[tileVectoredPos.y][tileVectoredPos.x]
        ]);

        if (!this._previousTilePosition.equals(this.tilePosition) && !this._destroyed) {
            EventManager.notify('entity_moved_from_tile_to_tile', {
                entity: this,
                from: this._previousTilePosition,
                to: this.tilePosition
            });
        }
    }

}

export {Entity}
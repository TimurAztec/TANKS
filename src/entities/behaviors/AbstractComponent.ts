import { Entity } from "../entity";
import {IComponent} from "./IComponent";

export abstract class AbstractComponent implements IComponent {

    protected _entity: Entity;
    protected readonly _typeID: string = '';

    constructor(source?: IComponent) {}

    public get typeID(): string {
        return this._typeID
    }

    public setEntity<T extends Entity>(entity: T): AbstractComponent {
        this._entity = entity;
        return this;
    }

    public update(dt: number): void {}

    public remove(): void {}

    public abstract clone(): IComponent;
}

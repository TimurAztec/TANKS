import { Entity } from "../entity";
import {IComponent} from "./IComponent";

export abstract class AbstractComponent implements IComponent {

    protected _entity: Entity;
    protected readonly _typeID: string = '';

    constructor(source?: IComponent) {}

    public get typeID(): string {
        return this._typeID
    }

    // you are not using return value
    public setEntity<T extends Entity>(entity: T): AbstractComponent {
        this._entity = entity;
        return this;
    }

    public update(dt: number): void {}

    public remove(): void {}

    public clone(): AbstractComponent {
        const cloned = this.constructor as new (value: AbstractComponent) => this;
        return new cloned(this);
    };
}

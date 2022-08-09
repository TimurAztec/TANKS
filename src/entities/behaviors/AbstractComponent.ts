import { Entity } from "../entity";
import {IComponent} from "./IComponent";

export abstract class AbstractComponent implements IComponent {

    protected _entity: Entity;

    public setEntity<T extends Entity>(entity: T): AbstractComponent {
        this._entity = entity;
        return this;
    }

    public update(dt: number) {}

}
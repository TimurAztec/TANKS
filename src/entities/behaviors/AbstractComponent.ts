import { Entity } from "../entity";
import {IComponent} from "./IComponent";

export abstract class AbstractComponent implements IComponent {

    protected _entity: Entity;

    public setEntity(entity: Entity): void {
        this._entity = entity;
    }

    public update(dt: number) {}

}
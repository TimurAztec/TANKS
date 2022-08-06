import { Entity } from "../entity";
import {IBehavior} from "./IBehavior";

export abstract class AbstractBehavior implements IBehavior {

    protected _entity: Entity;

    public setEntity(entity: Entity): void {
        this._entity = entity;
    }

}
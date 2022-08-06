import { Entity } from "../entity";

export interface IBehavior {
    setEntity(entity: Entity): void;
}
import { Entity } from "../entity";

export interface IComponent {
    setEntity(entity: Entity): void;
    update(dt: number): void;
    remove(): void;
    typeID: string;
    clone(): IComponent;
}
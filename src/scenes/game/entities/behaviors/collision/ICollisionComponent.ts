import { Entity } from "../../entity";
import {IComponent} from "../IComponent";

export interface ICollisionComponent extends IComponent {
    collidedWith(object: Entity): void;
    onCollision(callback: Function): void;
    onCollidedWith(id: string, callback: Function): void;
}
import { Entity } from "../../entity";
import {IComponent} from "../IComponent";

export interface ICollisionComponent extends IComponent {
    collidedWith(object: Entity): void;
    onCollidedWith(callback: Function): void;
}
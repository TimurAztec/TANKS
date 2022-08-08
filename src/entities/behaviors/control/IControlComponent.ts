import {IComponent} from "../IComponent";

export interface IControlComponent extends IComponent {
    onActionUp(callback: Function): void;
    onActionDown(callback: Function): void;
    onActionLeft(callback: Function): void;
    onActionRight(callback: Function): void;
    onActionSpace(callback: Function): void;
    triggerActionUp(): void;
    triggerActionDown(): void;
    triggerActionLeft(): void;
    triggerActionRight(): void;
    triggerActionSpace(): void;
}
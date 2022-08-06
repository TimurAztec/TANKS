import {IBehavior} from "../IBehavior";

export interface IControlBehavior extends IBehavior {
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
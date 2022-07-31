export interface IControlBehavior {
    onActionUp(callback: Function): void;
    onActionDown(callback: Function): void;
    onActionLeft(callback: Function): void;
    onActionRight(callback: Function): void;
    onActionSpace(callback: Function): void;
}
import {IControlBehavior} from "./IControlBehavior";

abstract class AbstractControlBehavior implements IControlBehavior {
    protected actionUpCallback: Function;
    protected actionDownCallback: Function;
    protected actionLeftCallback: Function;
    protected actionRightCallback: Function;
    protected actionSpaceCallback: Function;


    public onActionDown(callback: Function): void {
        this.actionDownCallback = callback;
    }

    public onActionLeft(callback: Function): void {
        this.actionLeftCallback = callback;
    }

    public onActionRight(callback: Function): void {
        this.actionRightCallback = callback;
    }

    public onActionSpace(callback: Function): void {
        this.actionSpaceCallback = callback;
    }

    public onActionUp(callback: Function): void {
        this.actionUpCallback = callback;
    }

}

export { AbstractControlBehavior }
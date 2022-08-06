import {AbstractControlBehavior} from "./abstract-control-behavior";
import {IEventListener} from "../../../ustils/events/IEventListener";
import {EventManager} from "../../../event-manager";

class PlayerControlBehavior extends AbstractControlBehavior implements IEventListener {

    constructor() {
        super();
        EventManager.subscribe('keydown', this);
    }

    public onEvent(event:string, data:any): void {
        if (event == 'keydown') {
            switch (data) {
                case 'ArrowUp':
                    this.triggerActionUp();
                    break;
                case 'ArrowDown':
                    this.triggerActionDown();
                    break;
                case 'ArrowLeft':
                    this.triggerActionLeft();
                    break;
                case 'ArrowRight':
                    this.triggerActionRight();
                    break;
                case ' ':
                    this.triggerActionSpace();
                    break;
            }
        }
    }
}

export { PlayerControlBehavior }
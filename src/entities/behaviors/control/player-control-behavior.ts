import {AbstractControlBehavior} from "./abstract-control-behavior";
import {IEventListener} from "../../../ustils/events/IEventListener";
import {EventManager} from "../../../event-manager";

class PlayerControlBehavior extends AbstractControlBehavior implements IEventListener {

    constructor() {
        super();
        EventManager.subscribe('keydown', this);
    }

    public onEvent(event:string, data:any): void {
        if (event == 'keydown' && typeof data == 'string') {
            switch (data) {
                case 'ArrowUp':
                    if (this.actionUpCallback)
                        this.actionUpCallback();
                    break;
                case 'ArrowDown':
                    if (this.actionDownCallback)
                        this.actionDownCallback();
                    break;
                case 'ArrowLeft':
                    if (this.actionLeftCallback)
                        this.actionLeftCallback();
                    break;
                case 'ArrowRight':
                    if (this.actionRightCallback)
                        this.actionRightCallback();
                    break;
                case ' ':
                    if (this.actionSpaceCallback)
                        this.actionSpaceCallback();
                    break;
            }
        }
    }
}

export { PlayerControlBehavior }
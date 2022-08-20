import {AbstractControlComponent} from "./abstract-control-component";
import {EventManager} from "../../../event-manager";
import { IEventListener } from "../../../utils/events/IEventListener";

class PlayerControlComponent extends AbstractControlComponent implements IEventListener {

    constructor(source?: PlayerControlComponent) {
        super(source);
        EventManager.subscribe('keydown', this);
    }

    public onEvent(event:string, data:any): void {
        if (event == 'keydown') {
            switch (data) {
                case 'ArrowUp':
                    this.triggerActionUp();
                    break;
                case 'w':
                    this.triggerActionUp();
                    break;
                case 'ArrowDown':
                    this.triggerActionDown();
                    break;
                case 's':
                    this.triggerActionDown();
                    break;
                case 'ArrowLeft':
                    this.triggerActionLeft();
                    break;
                case 'a':
                    this.triggerActionLeft();
                    break;
                case 'ArrowRight':
                    this.triggerActionRight();
                    break;
                case 'd':
                    this.triggerActionRight();
                    break;
                case ' ':
                    this.triggerActionSpace();
                    break;
            }
        }
    }

    public clone(): PlayerControlComponent { return new PlayerControlComponent(this) }
}

export { PlayerControlComponent }
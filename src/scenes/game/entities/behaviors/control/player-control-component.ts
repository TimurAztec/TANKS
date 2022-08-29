import { EventManager } from "../../../../../event-manager";
import { IEventListener } from "../../../../../utils/events/IEventListener";
import {AbstractControlComponent} from "./abstract-control-component";

class PlayerControlComponent extends AbstractControlComponent implements IEventListener {

    protected action: Function = () => {}

    constructor(source?: PlayerControlComponent) {
        super(source);
        EventManager.subscribe('keydown', this);
        EventManager.subscribe('keyup', this);
    }

    public onEvent(event:string, data:any): void {
        if (event == 'keydown') {
            switch (data) {
                case 'ArrowUp':
                    this.action = this.triggerActionUp;
                    break;
                case 'w':
                    this.action = this.triggerActionUp;
                    break;
                case 'ArrowDown':
                    this.action = this.triggerActionDown;
                    break;
                case 's':
                    this.action = this.triggerActionDown;
                    break;
                case 'ArrowLeft':
                    this.action = this.triggerActionLeft;
                    break;
                case 'a':
                    this.action = this.triggerActionLeft;
                    break;
                case 'ArrowRight':
                    this.action = this.triggerActionRight;
                    break;
                case 'd':
                    this.action = this.triggerActionRight;
                    break;
                case ' ':
                    this.action = this.triggerActionSpace;
                    break;
            }
        }
        if (event == 'keyup') {
            this.action = () => {}
        }
    }

    public update(dt: number): void {
        super.update(dt);
        this.action();
    }

    public clone(): PlayerControlComponent { return new PlayerControlComponent(this) }
}

export { PlayerControlComponent }
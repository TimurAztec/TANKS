import { Entity } from "../entity";
import {IEventListener} from "../../utils/events/IEventListener";
import {ProjectileMovementComponent} from "../behaviors/movement/projectile-movement-component";
import {EventManager} from "../../event-manager";

class InWorldEventCounter extends Entity implements IEventListener {
    protected _count: number = 0;
    protected _timesToCount: number = 0;
    protected _onCountEnded: Function;
    protected _eventToCount: string;

    constructor(source?: InWorldEventCounter){
        super(source);
        this.setComponent(new ProjectileMovementComponent());
    }

    public get count(){
        return this._count;
    }

    public setEventToCount(event: string): InWorldEventCounter {
        if (this._eventToCount) {
            EventManager.unsubscribe(this._eventToCount, this);
        }
        this._eventToCount = event;
        EventManager.subscribe(this._eventToCount, this);
        return this;
    }

    public timesToCount(timesToCount: number): InWorldEventCounter {
        this._timesToCount = timesToCount;
        return this;
    }

    public onCountEnded(callback: Function): InWorldEventCounter {
        this._onCountEnded = callback;
        return this;
    }

    public update(dt: number): void {
        super.update(dt);
        if (this._count >= this._timesToCount) {
            this._count = 0;
            if (this._onCountEnded) {
                this._onCountEnded();
            }
        }
    }

    public clone(): InWorldEventCounter {
        return new InWorldEventCounter(this);
    }

    public onEvent(event: string, data: any): void {
        super.onEvent(event, data);
        this._count++;
    }
}

export { InWorldEventCounter }
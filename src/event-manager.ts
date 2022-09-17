import { IEventListener } from "./utils/events/IEventListener";

class EventManager {
    protected static _instance: EventManager;

    protected constructor() {}

    public static instance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }

        return EventManager._instance;
    }

    protected _listeners: Map<string, IEventListener[]> = new Map<string, IEventListener[]>();

    public subscribe(event: string, listener: IEventListener): void {
        const listeners: any[] = this._listeners.get(event);
        this._listeners.set(event, listeners ? [...listeners, listener] : [listener]);
    }

    public unsubscribe(event: string, listener: IEventListener): void {
        const listeners: IEventListener[] = this._listeners.get(event);
        if (listeners && listeners.indexOf(listener) >= 0) {
            listeners.splice(listeners.indexOf(listener), 1);
            this._listeners.set(event, listeners);
        }
    }

    public notify(event: string, data: any): void {
        const listeners: IEventListener[] = this._listeners.get(event);
        if (listeners) {
            for (let listener of listeners) {
                listener.onEvent(event, data);
            }
        }
    }
}

export { EventManager }
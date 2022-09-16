import { IEventListener } from "./utils/events/IEventListener";

// this class better to have as singleton
class EventManager {
    private constructor() {}

    private static _listeners: Map<string, IEventListener[]> = new Map<string, IEventListener[]>();

    public static subscribe(event: string, listener: any): void {
        const listeners: any[] = EventManager._listeners.get(event);
        EventManager._listeners.set(event, listeners ? [...listeners, listener] : [listener]);
    }

    // don't use `any`, typescript is created for types
    public static unsubscribe(event: string, listener: any): void {
        const listeners: IEventListener[] = EventManager._listeners.get(event);
        if (listeners && listeners.indexOf(listener)) {
            listeners.splice(listeners.indexOf(listener), 1);
            EventManager._listeners.set(event, listeners);
        }
    }

    public static notify(event: string, data: any): void {
        const listeners: IEventListener[] = EventManager._listeners.get(event);
        if (listeners) {
            for (let listener of listeners) {
                listener.onEvent(event, data);
            }
        }
    }
}

export { EventManager }
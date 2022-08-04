import {EventManager} from "../../event-manager";

class ClientInputHandler {

    protected constructor() {}

    public static init(): void {
        window.addEventListener('keydown', (ev => {
            EventManager.notify('keydown', ev.key);
        }));
        window.addEventListener('keyup', (ev => {
            EventManager.notify('keyup', ev.key);
        }));
        window.addEventListener('keypress', (ev => {
            EventManager.notify('keypress', ev.key);
        }));
    }

}

export { ClientInputHandler }
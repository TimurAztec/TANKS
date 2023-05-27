import {EventManager} from "../../event-manager";

class ClientInputHandler {

    protected constructor() {}

    public static init(): void {
        window.addEventListener('keydown', (ev => {
            EventManager.instance().notify('keydown', ev.key);
        }));
        window.addEventListener('keyup', (ev => {
            EventManager.instance().notify('keyup', ev.key);
        }));
        window.addEventListener('keypress', (ev => {
            EventManager.instance().notify('keypress', ev.key);
        }));
    }

}

export { ClientInputHandler }
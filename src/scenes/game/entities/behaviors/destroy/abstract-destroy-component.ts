import {AbstractComponent} from "../AbstractComponent";
import {IDestroyComponent} from "./IDestroyComponent";

export abstract class AbstractDestroyComponent extends AbstractComponent implements IDestroyComponent {

    protected readonly _typeID: string = 'destroy';
    protected _destroyCallback: Function = () => {};

    constructor(source?: AbstractDestroyComponent) {
        super(source);
        if (source?._destroyCallback) {
            this._destroyCallback = source._destroyCallback;
        }
    }

    public onDestroy(callback: Function): AbstractDestroyComponent {
        this._destroyCallback = callback;
        return this;
    }

    public destroy(): void {
        this._destroyCallback();
    }
}
import {AbstractComponent} from "../AbstractComponent";
import {IWeaponComponent} from "./IWeaponComponent";

export abstract class AbstractWeaponComponent extends AbstractComponent implements IWeaponComponent {

    protected readonly _typeID: string = 'weapon';
    protected _reloadCounter: number;
    protected _reloadTime: number;
    protected _reloaded: boolean;

    constructor(source?: AbstractWeaponComponent) {
        super(source);
        this._reloaded = true;
        this._reloadTime = 1;
        this._reloadCounter = 0;
    }

    public fire(): void {
        this._reloadCounter = 0;
        this._reloaded = false;
    }

    public setReloadTime(value: number): void {
        this._reloadTime = value;
    }

    public update(dt: number): void {
        this._reloadCounter += dt;
        if (this._reloadCounter > this._reloadTime) {
            this._reloaded = true;
        }
    }

}
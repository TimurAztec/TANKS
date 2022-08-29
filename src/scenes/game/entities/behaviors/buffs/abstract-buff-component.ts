import { IIndexable } from "../../../../../utils/utils";
import { AbstractComponent } from "../AbstractComponent";
import { IBuffComponent } from "./IBuffComponent";

abstract class AbstractBuffComponent extends AbstractComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff';
    protected _buffDuration: number;
    protected _timePassed: number;
    protected _defaultValue: any;
    protected _isFirstUpdate: boolean;
    //protected _propToChange: keyof typeof this._entity;
    protected _propToChange: string;
    protected _changeTo: any;

    constructor(source?: AbstractBuffComponent){
        super(source);
        this._timePassed = 0;
        this._buffDuration = 0;
        this._isFirstUpdate = true;
    }

    public applyBuff(duration?: number): IBuffComponent {
        this._buffDuration = duration;
        
        return this;
    }

    public update(dt: number): void {
        if(this._isFirstUpdate){ this.firstUpdate() }
        if(!this._buffDuration){
            this._entity.removeComponent(AbstractBuffComponent);
            return
        }
        this._timePassed += dt;
        if(this._buffDuration <= this._timePassed){
            this.endBuff()
        }
    }

    protected firstUpdate(): void {
        this._defaultValue = this._entity[this._propToChange as keyof typeof this._entity];
        (this._entity as IIndexable)[this._propToChange] = this._changeTo;
        this._isFirstUpdate = false;
    }

    protected endBuff(): void {
        (this._entity as IIndexable)[this._propToChange] = this._defaultValue
        this._entity.removeComponent(AbstractBuffComponent);
    }

    public remove(): void {
        super.remove();
        this.endBuff();
    }
}

export { AbstractBuffComponent }
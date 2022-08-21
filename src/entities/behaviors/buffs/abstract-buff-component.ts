import { AbstractComponent } from "../AbstractComponent";
import { IComponent } from "../IComponent";
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
        this._isFirstUpdate = false;
    }

    public applyBuff(propToChange: string, changeTo: any, duration?: number): IBuffComponent {
        
        this._buffDuration = duration;
        this._changeTo = changeTo;
        this._propToChange = propToChange;
        
        return this;

    }

    public update(dt: number): void {
        if(!this._buffDuration){
            return
        }
        this._timePassed += dt;
        if(this._buffDuration <= this._timePassed){
            
            //@ts-ignore
            this._entity[this._propToChange] = this._defaultValue
            this._entity.removeComponent(AbstractBuffComponent);
        }
        if(!this._isFirstUpdate){
            this._defaultValue = this._entity[this._propToChange as keyof typeof this._entity];
            //@ts-ignore
            this._entity[this._propToChange] = this._changeTo;
            this._isFirstUpdate = true;
        }
    }
}

export { AbstractBuffComponent }
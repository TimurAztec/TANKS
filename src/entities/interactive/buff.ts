import { IBuffComponent } from "../behaviors/buffs/IBuffComponent";
import { SpeedBuffComponent } from "../behaviors/buffs/speed-buff-component copy";
import { Entity } from "../entity";

class Buff extends Entity{
    protected _type: string;
    constructor(source?:Buff){
        super(source);
        this.type = source?._type || '';
    }
    public set type(value: string){
        this._type = value;
    }


    public getBuff(): IBuffComponent{
        switch(this._type){
            case 'buff-speed':
                return new SpeedBuffComponent().applyBuff('_speed', 15, 500);
            default: 
                break;
        }
    }

    public clone(): Buff {
        return new Buff(this);
    }
}
export {Buff}
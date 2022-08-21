import { Assets } from "../../assets-vars";
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
    public get type(){
        return this._type;
    }

    public getBuff(): IBuffComponent{
        switch(this._type)
        {
            case Assets.Bonuses.BONUS_SPEED:
                return new SpeedBuffComponent().applyBuff('speed', 5, 120);
            case Assets.Bonuses.BONUS_IMMORTAL:
                return new SpeedBuffComponent().applyBuff('speed', 5, 120);
            case Assets.Bonuses.BONUS_LIVE:
                return new SpeedBuffComponent().applyBuff('speed', 5, 120);
            case Assets.Bonuses.BONUS_SLOW:
                return new SpeedBuffComponent().applyBuff('speed', 5, 120);
            default: 
                break;
        }
    }

    public clone(): Buff {
        return new Buff(this);
    }
}
export {Buff}
import { Assets } from "../../assets-vars";
import { IBuffComponent } from "../behaviors/buffs/IBuffComponent";
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { LiveBuffComponent } from "../behaviors/buffs/live-buff-component";
import { SlowBuffComponent } from "../behaviors/buffs/slow-buff-component";
import { SpawnTractorBuffComponent } from "../behaviors/buffs/spawn-tractor-buff-component copy";
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
                return new SpeedBuffComponent().applyBuff(180);
            case Assets.Bonuses.BONUS_IMMORTAL:
                return new ImmortalBuffComponent().applyBuff(180);
            case Assets.Bonuses.BONUS_LIVE:
                return new LiveBuffComponent().applyBuff(0);
            case Assets.Bonuses.BONUS_SLOW:
                return new SlowBuffComponent().applyBuff(180);
            case Assets.Bonuses.BONUS_TRACTOR:
                return new SpawnTractorBuffComponent().applyBuff(0);
            default: 
                break;
        }
    }

    public clone(): Buff {
        return new Buff(this);
    }
}
export {Buff}
import { IBuffComponent } from "../behaviors/buffs/IBuffComponent";
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { LiveBuffComponent } from "../behaviors/buffs/live-buff-component";
import { SlowBuffComponent } from "../behaviors/buffs/slow-buff-component";
import { SpeedBuffComponent } from "../behaviors/buffs/speed-buff-component";
import { Entity } from "../entity";
import {SpawnSupportBuffComponent} from "../behaviors/buffs/spawn-support-buff-component";
import {randNum} from "../../../../utils/utils";
import { Constants } from "../../../../constants";
import { StaticMovementComponent } from "../behaviors/movement/static-movement-component";

const BUFF_TYPES: string[] = [
    Constants.AssetsTextures.BONUS_SPEED,
    Constants.AssetsTextures.BONUS_IMMORTAL,
    Constants.AssetsTextures.BONUS_LIVE,
    Constants.AssetsTextures.BONUS_SLOW,
    Constants.AssetsTextures.BONUS_TRACTOR
]

class Buff extends Entity{
    protected _type: string;

    constructor(source?:Buff){
        super(source);
        this.type = source?._type || '';
        this.setComponent(new StaticMovementComponent());
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
            case Constants.AssetsTextures.BONUS_SPEED:
                return new SpeedBuffComponent().applyBuff(240);
            case Constants.AssetsTextures.BONUS_IMMORTAL:
                return new ImmortalBuffComponent().applyBuff(300);
            case Constants.AssetsTextures.BONUS_LIVE:
                return new LiveBuffComponent().applyBuff(0);
            case Constants.AssetsTextures.BONUS_SLOW:
                return new SlowBuffComponent().applyBuff(300);
            case Constants.AssetsTextures.BONUS_TRACTOR:
                return new SpawnSupportBuffComponent().applyBuff(0);
            default: 
                break;
        }
    }

    public update(dt: number): void {
        if (this._initOnUpdate) {
            this.type = BUFF_TYPES[Math.floor(randNum(BUFF_TYPES.length))];
            this.setSkin({assetName: this.type});
        }
        super.update(dt);
    }
}
export {Buff}
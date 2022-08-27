import { Assets } from "../../assets-vars";
import { randNum } from "../../utils/utils";
import { IBuffComponent } from "../behaviors/buffs/IBuffComponent";
import { ImmortalBuffComponent } from "../behaviors/buffs/immortal-buff-component";
import { LiveBuffComponent } from "../behaviors/buffs/live-buff-component";
import { SlowBuffComponent } from "../behaviors/buffs/slow-buff-component";
import { SpawnTractorBuffComponent } from "../behaviors/buffs/spawn-tractor-buff-component copy";
import { SpeedBuffComponent } from "../behaviors/buffs/speed-buff-component copy";
import { ProjectileMovementComponent } from "../behaviors/movement/projectile-movement-component";
import { Entity } from "../entity";

class Buff extends Entity{
    protected _type: string;

    constructor(source?:Buff){
        super(source);
        this.type = source?._type || '';
        this.setComponent(new ProjectileMovementComponent());
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
                return new SpeedBuffComponent().applyBuff(240);
            case Assets.Bonuses.BONUS_IMMORTAL:
                return new ImmortalBuffComponent().applyBuff(300);
            case Assets.Bonuses.BONUS_LIVE:
                return new LiveBuffComponent().applyBuff(0);
            case Assets.Bonuses.BONUS_SLOW:
                return new SlowBuffComponent().applyBuff(300);
            case Assets.Bonuses.BONUS_TRACTOR:
                return new SpawnTractorBuffComponent().applyBuff(0);
            default: 
                break;
        }
    }

    public update(dt: number): void {
        if (this._initOnUpdate) {
            this.type = Assets.Bonuses.BUFF_TYPES[Math.floor(randNum(Assets.Bonuses.BUFF_TYPES.length))];
            this.setSkin({assetName: this.type});
        }
        super.update(dt);
    }

    public clone(): Buff {
        return new Buff(this);
    }
}
export {Buff}
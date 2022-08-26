import { IComponent } from "../IComponent";



export interface IBuffComponent extends IComponent{
    applyBuff(duration?: number ): IComponent;
}
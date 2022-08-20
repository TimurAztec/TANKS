import { IComponent } from "../IComponent";



export interface IBuffComponent extends IComponent{
    applyBuff(propToChange: string, changeTo: any, duration?: number ): IComponent;
}
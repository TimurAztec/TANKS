import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class SpeedBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-speed';

    public clone(): SpeedBuffComponent { return new SpeedBuffComponent(this) }

}

export {SpeedBuffComponent}
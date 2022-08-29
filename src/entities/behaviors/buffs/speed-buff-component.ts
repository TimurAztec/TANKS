import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class SpeedBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-speed';

    protected firstUpdate(): void {
        this._propToChange = 'speed';
        this._changeTo = 4;
        super.firstUpdate();
    }

    public clone(): SpeedBuffComponent { return new SpeedBuffComponent(this) }

}

export {SpeedBuffComponent}
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class SlowBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-speed';

    protected firstUpdate(): void {
        this._propToChange = 'speed';
        this._changeTo = 1;
        super.firstUpdate();
    }

    public clone(): SlowBuffComponent { return new SlowBuffComponent(this) }

}

export {SlowBuffComponent}
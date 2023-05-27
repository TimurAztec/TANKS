import { IIndexable } from "../../../../../utils/utils";
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class LiveBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-live';

    protected firstUpdate(): void {
        this._propToChange = 'health';
        this._changeTo = (this._entity as IIndexable)[this._propToChange] + 1;
        super.firstUpdate();
    }

}

export {LiveBuffComponent}
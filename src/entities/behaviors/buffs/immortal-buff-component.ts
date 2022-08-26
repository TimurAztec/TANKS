import { IIndexable } from "../../../utils/utils";
import { AbstractBuffComponent } from "./abstract-buff-component";
import { IBuffComponent } from "./IBuffComponent";

class ImmortalBuffComponent extends AbstractBuffComponent implements IBuffComponent{

    protected readonly _typeID: string = 'buff-immortal';

    protected firstUpdate(): void {
        this._propToChange = 'immortal';
        this._changeTo = true;
        super.firstUpdate();
    }

    public update(dt: number): void {
        super.update(dt);
        if(!this._buffDuration || !this._entity) {
            return
        }
        this._entity.alpha = dt % 1;
    }

    protected endBuff(): void {
        this._entity.alpha = 1;
        super.endBuff();
    }

    public clone(): ImmortalBuffComponent { return new ImmortalBuffComponent(this) }

}

export {ImmortalBuffComponent}
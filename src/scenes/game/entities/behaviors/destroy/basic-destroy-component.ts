import {IDestroyComponent} from "./IDestroyComponent";
import {AbstractDestroyComponent} from "./abstract-destroy-component";

export class BasicDestroyComponent extends AbstractDestroyComponent implements IDestroyComponent {

    public onDestroy(callback: Function): BasicDestroyComponent {
        return super.onDestroy(callback) as BasicDestroyComponent;
    }

    public clone(): BasicDestroyComponent {
        return new BasicDestroyComponent(this);
    }
}
import {IComponent} from "../IComponent";

export interface IDestroyComponent extends IComponent {
    destroy(): void;
    onDestroy(callback: Function): void;
}
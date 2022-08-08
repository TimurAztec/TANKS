import {IComponent} from "../IComponent";

export interface IWeaponComponent extends IComponent {
    fire(): void;
    setReloadTime(value: number): void;
    update(dt: number): void;
}
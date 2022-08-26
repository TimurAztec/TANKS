import {Container} from "pixi.js";

export abstract class Scene extends Container {
    protected paused: boolean = false;
    protected _preUpdateAction: Function = () => {};

    constructor() {
        super();
        this.name = this.constructor.name;
        this.sortableChildren = true;
    }

    public pause(): void {
        this.paused = true;
    }

    public resume(): void {
        this.paused = false;
    }

    public update(dt: number): void {
        if (this.paused) return;
        this._preUpdateAction();
    }

}
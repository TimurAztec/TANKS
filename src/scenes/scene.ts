import {Container} from "pixi.js";

export abstract class Scene extends Container {
    protected paused: boolean = false;
    protected _preUpdateAction: Function = () => {};
    protected _sceneTime: number = 0;

    public get sceneTime(): number {
        return this._sceneTime;
    }

    constructor() {
        super();
        this.name = this.constructor.name;
        this._sceneTime = 0;
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
        this._sceneTime += dt;
        this._preUpdateAction();
    }

}
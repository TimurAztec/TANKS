import {Container} from "pixi.js";

export abstract class Scene extends Container {
    protected paused: boolean = false;

    constructor() {
        super();
        this.name = this.constructor.name;
    }

    public pause(): void {
        this.paused = true;
    }

    public resume(): void {
        this.paused = false;
    }

    public update(dt: number): void {
        if (this.paused) return;
    }

}
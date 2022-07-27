import {Container} from "pixi.js";
import {IScene, ISceneView} from "./interfaces";

export class View extends Container implements ISceneView {

    protected _controller: IScene;

    public get controller(): IScene {
        return this._controller;
    }

    public set controller(value: IScene) {
        if (!this._controller) {
            this._controller = value;
        } else {
            throw new Error('View controller already set');
        }
    }

    update(dt: number) {}

}
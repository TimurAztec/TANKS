import {Container} from "pixi.js";

export interface IScene {
    view: ISceneView;
}

export interface ISceneView extends Container {
    controller: IScene;
    update(dt: number): void;
}
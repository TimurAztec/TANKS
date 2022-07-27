import {IScene, ISceneView} from "./interfaces";

export abstract class Scene implements IScene {

    protected _view: ISceneView;

    public get view(): ISceneView {
        return this._view;
    }

    constructor(view: ISceneView) {
        this._view = view;
        this._view.controller = this;
    }

}
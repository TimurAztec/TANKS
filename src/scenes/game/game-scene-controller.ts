import {Scene} from "../scene";
import {ISceneView} from "../interfaces";
import {GameSceneView} from "./game-scene-view";

export class GameScene extends Scene {

    public get view(): GameSceneView {
        return this._view as GameSceneView;
    }

    constructor(view: ISceneView) {
        super(view);
    }
}
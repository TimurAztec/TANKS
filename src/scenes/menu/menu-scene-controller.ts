import {Scene} from "../scene";
import {ISceneView} from "../interfaces";
import {MenuSceneView} from "./menu-scene-view";
import {SceneManager} from "../../scene-manager";
import {GameScene} from "../game/game-scene-controller";
import {GameSceneView} from "../game/game-scene-view";

export class MenuScene extends Scene {

    public get view(): MenuSceneView {
        return this._view as MenuSceneView;
    }

    constructor(view: ISceneView) {
        super(view);
    }

    public startGame(): void {
        SceneManager.changeScene(new GameScene(new GameSceneView()));
    }
}
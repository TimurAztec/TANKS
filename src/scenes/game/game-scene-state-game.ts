import {GameSceneState} from "./game-scene-state";
import {GameSceneStatePause} from "./game-scene-state-pause";
import {GameScene} from "./game-scene";

class GameSceneStateGame extends GameSceneState {

    constructor(scene: GameScene) {
        super(scene);
        for (let ch of scene.children) {
            ch.visible = true;
        }
        scene.pauseMenu.visible = false;
    }

    public pausePressed(): void {
        this._gameScene.state = new GameSceneStatePause(this._gameScene);
    }
}

export { GameSceneStateGame }
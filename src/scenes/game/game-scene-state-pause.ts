import {GameSceneState} from "./game-scene-state";
import {GameSceneStateGame} from "./game-scene-state-game";
import {GameScene} from "./game-scene";

class GameSceneStatePause extends GameSceneState {

    constructor(scene: GameScene) {
        super(scene);
        for (let ch of scene.children) {
            ch.visible = false;
        }
        scene.pauseMenu.visible = true;
    }

    public pausePressed(): void {
        this._gameScene.state = new GameSceneStateGame(this._gameScene);
    }
}

export { GameSceneStatePause }
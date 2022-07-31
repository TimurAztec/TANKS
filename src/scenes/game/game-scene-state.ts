import {GameScene} from "./game-scene";

abstract class GameSceneState {
    protected _gameScene: GameScene;

    constructor(scene: GameScene) {
        this._gameScene = scene;
    }

    public pausePressed(): void {

    }

    public update(dt: number): void {

    }
}

export { GameSceneState }
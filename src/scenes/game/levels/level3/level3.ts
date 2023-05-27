import { SceneManager } from '../../../../scene-manager';
import { GameScene } from '../../game-scene';
import { GameWonScene } from '../../game-won-screen';
import * as levelData from './level3.json';

export class Level3Scene extends GameScene {

    constructor() {
        super();

        this.loadLevel(levelData);
    }

    protected onTeamWon(): void {
        SceneManager.changeScene(new GameWonScene());
        this.destroy();
    }

}
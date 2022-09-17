import { Constants } from '../../../../constants';
import { SceneManager } from '../../../../scene-manager';
import { SavesHandler } from '../../../../utils/saves-handler';
import { GameWonScene } from '../../game-won-screen';
import { LevelScene } from '../level-scene';
import * as levelData from './level1.json';

export class Level1Scene extends LevelScene {
    
    constructor() {
        super();

        this.loadLevel(levelData);
        SavesHandler.instance().saveData(Constants.GlobalNames.SCORE, 0);
    }

    protected onTeamWon(): void {
        // SceneManager.changeScene(new Level2Scene());
        SceneManager.changeScene(new GameWonScene());
        this.destroy();
    }

}
import { Constants } from '../../../../constants';
import { SceneManager } from '../../../../scene-manager';
import { SavesHandler } from '../../../../utils/saves-handler';
import { LevelScene } from '../level-scene';
import { Level2Scene } from '../level2/level2';
import * as levelData from './level1.json';

export class Level1Scene extends LevelScene {
    
    constructor() {
        super();

        this.loadLevel(levelData);
        SavesHandler.instance().saveData(Constants.GlobalNames.SCORE, 0);
    }

    protected onTeamWon(): void {
        SceneManager.changeScene(new Level2Scene());
        this.destroy();
    }

}
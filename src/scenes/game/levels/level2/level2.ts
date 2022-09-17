import { SceneManager } from '../../../../scene-manager';
import { GameScene } from '../../game-scene';
import { Level3Scene } from '../level3/level3';
import * as levelData from './level2.json';

export class Level2Scene extends GameScene {

    constructor() {
        super();

        this.loadLevel(levelData);
    }

    protected onTeamWon(): void {
        SceneManager.changeScene(new Level3Scene());
        this.destroy();
    }
    
}
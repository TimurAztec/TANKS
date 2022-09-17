import { Howl } from 'howler';
import { Loader } from 'pixi.js';
import { Constants } from '../../../../constants';
import { EventManager } from '../../../../event-manager';
import { SceneManager } from '../../../../scene-manager';
import { MenuScene } from '../../../menu/menu-scene';
import { GameConstants } from '../../game-constants';
import { GameScene } from '../../game-scene';
import { Level3Scene } from '../level3/level3';
import * as levelData from './level2.json';

export class Level2Scene extends GameScene {

    constructor() {
        super();

        this.loadLevel(levelData);
        EventManager.instance().subscribe(GameConstants.Events.TEAM_LOST, this);
        EventManager.instance().subscribe(GameConstants.Events.TEAM_WON, this);
    }


    // alnmost the same as level3 and level1
    public onEvent(event: string, data: any): void {
        if (this.paused) return;
        super.onEvent(event, data);
        if (event == GameConstants.Events.TEAM_LOST) {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.LOSE].url, onend: () => {
                        SceneManager.changeScene(new MenuScene());
                        this.destroy();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
        if (event == GameConstants.Events.TEAM_WON && data == GameConstants.Teams.PLAYER_1) {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.WIN].url, onend: () => {
                        SceneManager.changeScene(new Level3Scene());
                        this.destroy();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
    }

}
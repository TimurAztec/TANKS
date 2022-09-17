import { Howl } from 'howler';
import { Loader } from 'pixi.js';
import { Constants } from '../../../../constants';
import { EventManager } from '../../../../event-manager';
import { SceneManager } from '../../../../scene-manager';
import { MenuScene } from '../../../menu/menu-scene';
import { GameConstants } from '../../game-constants';
import { GameScene } from '../../game-scene';
import { GameWonScene } from '../../game_won_screen';
import * as levelData from './level3.json';

export class Level3Scene extends GameScene {

    constructor() {
        super();

        this.loadLevel(levelData);
        EventManager.instance().subscribe(GameConstants.Events.TEAM_LOST, this);
        EventManager.instance().subscribe(GameConstants.Events.TEAM_WON, this);
    }

    public onEvent(event: string, data: any): void {
        if (this.paused) return;
        super.onEvent(event, data);
        if (event == GameConstants.Events.TEAM_LOST) {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.LOSE].url, onend: () => {
                        // you are creating menu scene each time when you want to go there, this is not good
                        SceneManager.changeScene(new MenuScene());
                        this.destroy();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
        if (event == GameConstants.Events.TEAM_WON && data == GameConstants.Teams.PLAYER_1) {
            this._preUpdateAction = () => {
                this.pause();

                // you have memory leak, possibly because of this code https://prnt.sc/ZkqShlhkT_Er
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.WIN].url, onend: () => {
                        SceneManager.changeScene(new GameWonScene());
                        this.destroy();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
    }

}
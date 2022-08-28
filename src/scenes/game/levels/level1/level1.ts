import { Howl } from 'howler';
import { Loader } from 'pixi.js';
import { EventManager } from '../../../../event-manager';
import { SceneManager } from '../../../../scene-manager';
import { SavesHandler } from '../../../../utils/saves-handler';
import { MenuScene } from '../../../menu/menu-scene';
import { GameScene } from '../../game-scene';
import { GameWonScene } from '../../game_won_screen';
import { Level2Scene } from '../level2/level2';
import * as levelData from './level1.json';

export class Level1Scene extends GameScene {
    
    constructor() {
        super();

        this.loadLevel(levelData);
        EventManager.subscribe('team_lost', this);
        EventManager.subscribe('team_won', this);
        SavesHandler.saveData('score', 0);
    }

    public onEvent(event: string, data: any): void {
        if (this.paused) return;
        super.onEvent(event, data);
        if (event == 'team_lost') {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources['lose_sound'].url}).play();
                SceneManager.changeScene(new MenuScene());
                this.destroy();
                this._preUpdateAction = () => {};
            }
        }
        if (event == 'team_won' && data == 'player1') {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren.length = 0;
                this.tileMap.length = 0;
                new Howl({ src: Loader.shared.resources['win_sound'].url}).play();
                SceneManager.changeScene(new GameWonScene());
                this.destroy();
                this._preUpdateAction = () => {};
            }
        }
    }

}
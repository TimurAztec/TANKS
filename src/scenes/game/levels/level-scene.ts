import { Howl } from "howler";
import { Loader } from "pixi.js";
import { Constants } from "../../../constants";
import { EventManager } from "../../../event-manager";
import { SceneManager } from "../../../scene-manager";
import { IEventListener } from "../../../utils/events/IEventListener";
import { GameConstants } from "../game-constants";
import { GameScene } from "../game-scene";

export abstract class LevelScene extends GameScene implements IEventListener {

    constructor() {
        super();

        EventManager.instance().subscribe(GameConstants.Events.GAME_OVER, this);
        EventManager.instance().subscribe(GameConstants.Events.TEAM_WON, this);
    }

    public onEvent(event: string, data: any): void {
        if (this.paused) return;
        super.onEvent(event, data);
        if (event == GameConstants.Events.GAME_OVER) {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren = [];
                this.tileMap = [];
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.LOSE].url, onend: () => {
                        this.onGameOver();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
        if (event == GameConstants.Events.TEAM_WON) {
            this._preUpdateAction = () => {
                this.pause();
                this.dynamicChildren = [];
                this.tileMap = [];
                new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.WIN].url, onend: () => {
                        this.onTeamWon();
                        this._preUpdateAction = () => {};
                    }}).play();
            }
        }
    }

    protected onGameOver() {
        SceneManager.changeScene('MenuScene');
        this.destroy();
    }

    protected onTeamWon() {
        this.destroy();
    }
    
}
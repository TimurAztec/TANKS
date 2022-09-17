import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import { MenuScene } from "../menu/menu-scene";
import { Howl } from "howler";
import {SavesHandler} from "../../utils/saves-handler";
import {Constants} from "../../constants";

export class GameWonScene extends Scene {

    protected background: Sprite;
    protected startButton: Sprite;
    protected score: Text;
    protected logoText: Text;
    protected music: Howl;

    constructor() {
        super();

        this.background = new Sprite(Loader.shared.resources[Constants.AssetsTextures.WIN_MENU_BG].texture);
        this.logoText = new Text('You`ve completed the game!', new TextStyle({
            fontSize: 64,
            align: "center",
            fill: "#ffffff",
        }));
        this.startButton = new Sprite(Loader.shared.resources[Constants.AssetsTextures.BUTTON_EXIT].texture);

        this.background.anchor.set(0.5);
        this.background.x = SceneManager.width / 2;
        this.background.y = SceneManager.height / 2;
        this.background.width = SceneManager.width;
        this.background.height = SceneManager.height;

        this.logoText.anchor.set(0.5);
        this.logoText.x = SceneManager.width / 2;
        this.logoText.y = SceneManager.height / 6;

        this.startButton.anchor.set(0.5);
        this.startButton.x = SceneManager.width / 2;
        this.startButton.y = SceneManager.height / 1.15;
        this.startButton.scale.set(2);
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.addChild(this.background);
        this.addChild(this.logoText);

        if (SavesHandler.instance().loadData('score')) {
            this.score = new Text(`Score: ${SavesHandler.instance().loadData('score')}`, new TextStyle({
                fontSize: 84,
                align: "center",
                fill: "#ffffff",
            }));
            this.score.anchor.set(0.5);
            this.score.x = SceneManager.width / 2;
            this.score.y = SceneManager.height / 2;
            this.addChild(this.score);
        }

        this.addChild(this.startButton);

        this.initActions();
        SceneManager.moveCameraTo(new Point(0, 0));
    }

    protected initActions() {
        this.music = new Howl({ src: Loader.shared.resources[Constants.AssetsSounds.WIN_GAME_MUSIC].url});
        this.music.play();

        this.startButton.on('click', () => {
            SceneManager.changeScene('MenuScene');
            this.music.stop();
            this.destroy();
        });
    }

}
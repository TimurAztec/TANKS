import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import { MenuScene } from "../menu/menu-scene";
import { Howl } from "howler";

export class GameWonScene extends Scene {

    protected background: Sprite;
    protected startButton: Sprite;
    protected scoreButton: Sprite;
    protected logoText: Text;
    protected music: Howl;

    constructor() {
        super();

        this.background = new Sprite(Loader.shared.resources['win_background'].texture);
        this.logoText = new Text('You`ve completed the game!', new TextStyle({
            fontSize: 64,
            align: "center",
            fill: "#ffffff",
        }));
        this.startButton = new Sprite(Loader.shared.resources['button_exit'].texture);
        // this.scoreButton = new Sprite(Loader.shared.resources[Assets.Buttons.BUTTON_SCORES].texture);

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

        // this.scoreButton.anchor.set(0.5);
        // this.scoreButton.x = SceneManager.width / 2;
        // this.scoreButton.y = SceneManager.height / 2 + this.scoreButton.height*2;
        // this.scoreButton.interactive = true;
        // this.scoreButton.buttonMode = true;

        this.addChild(this.background);
        this.addChild(this.logoText);
        this.addChild(this.startButton);
        // this.addChild(this.scoreButton);

        this.initActions();
        SceneManager.moveCameraTo(new Point(0, 0));
    }

    protected initActions() {
        this.music = new Howl({ src: Loader.shared.resources['endgame_music'].url});
        this.music.play();

        this.startButton.on('click', () => {
            SceneManager.changeScene(new MenuScene());
            this.music.stop();
            this.destroy();
        });
    }

}
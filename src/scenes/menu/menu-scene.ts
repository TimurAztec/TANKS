import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {GameScene} from "../game/game-scene";
import {Loader, Sprite, Text, TextStyle} from "pixi.js";
import { Assets } from "../../assets-vars";
import { Level1Scene } from "../game/levels/level1/level1";

export class MenuScene extends Scene {

    protected startButton: Sprite;
    protected scoreButton: Sprite;
    protected logoText: Text;

    constructor() {
        super();

        this.logoText = new Text('War Thunder', new TextStyle({
            fontSize: 42,
            align: "center",
            fill: "#754c24",
        }));
        this.startButton = new Sprite(Loader.shared.resources[Assets.Buttons.BUTTON].texture);
        this.scoreButton = new Sprite(Loader.shared.resources[Assets.Buttons.BUTTON_SCORES].texture);

        this.logoText.anchor.set(0.5);
        this.logoText.x = SceneManager.width / 2;
        this.logoText.y = SceneManager.height / 3;

        this.startButton.anchor.set(0.5);
        this.startButton.x = SceneManager.width / 2;
        this.startButton.y = SceneManager.height / 2;
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.scoreButton.anchor.set(0.5);
        this.scoreButton.x = SceneManager.width / 2;
        this.scoreButton.y = SceneManager.height / 2 + this.scoreButton.height*2;
        this.scoreButton.interactive = true;
        this.scoreButton.buttonMode = true;

        this.addChild(this.logoText);
        this.addChild(this.startButton);
        this.addChild(this.scoreButton);

        this.initActions();
    }

    protected initActions() {
        this.startButton.on('click', () => {
            this.startGame();
        });
    }

    public startGame(): void {
        SceneManager.changeScene(new Level1Scene());
        this.destroy();
    }

}
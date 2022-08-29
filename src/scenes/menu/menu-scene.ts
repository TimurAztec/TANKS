import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import { Level1Scene } from "../game/levels/level1/level1";
import {SavesHandler} from "../../utils/saves-handler";

export class MenuScene extends Scene {

    protected background: Sprite;
    protected startButton: Sprite;
    protected score: Text;
    protected logoText: Text;

    constructor() {
        super();

        this.background = new Sprite(Loader.shared.resources['menu_background'].texture);
        this.logoText = new Text('Orcs Thunder', new TextStyle({
            fontSize: 84,
            align: "center",
            fill: "#ffffff",
        }));
        this.startButton = new Sprite(Loader.shared.resources['button_play'].texture);

        this.background.anchor.set(0.5);
        this.background.x = SceneManager.width / 2;
        this.background.y = SceneManager.height / 2;
        this.background.width = SceneManager.width;
        this.background.height = SceneManager.height;

        this.logoText.anchor.set(0.5);
        this.logoText.x = SceneManager.width / 2;
        this.logoText.y = SceneManager.height / 4;

        this.startButton.anchor.set(0.5);
        this.startButton.x = SceneManager.width / 2;
        this.startButton.y = SceneManager.height / 1.15;
        this.startButton.scale.set(2);
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.addChild(this.background);
        this.addChild(this.logoText);

        if (SavesHandler.loadData('score')) {
            this.score = new Text(`Score: ${SavesHandler.loadData('score') as number}`, new TextStyle({
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
        this.startButton.on('click', () => {
            this.startGame();
        });
    }

    public startGame(): void {
        SceneManager.changeScene(new Level1Scene());
        this.destroy();
    }

}
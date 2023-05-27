import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import { Level1Scene } from "../game/levels/level1/level1";
import {SavesHandler} from "../../utils/saves-handler";
import {Constants} from "../../constants";
import { PainScreenScene } from "./plain-screen-scene";

export class MenuScene extends PainScreenScene {

    protected background: Sprite;
    protected startButton: Sprite;
    protected score: Text;
    protected logoText: Text;

    protected initVisuals(): void {
        this.background = new Sprite(Loader.shared.resources[Constants.AssetsTextures.MENU_BG].texture);
        this.logoText = new Text('Orcs Thunder', new TextStyle({
            fontSize: 84,
            align: "center",
            fill: "#ffffff",
        }));
        this.startButton = new Sprite(Loader.shared.resources[Constants.AssetsTextures.BUTTON_PLAY].texture);

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

        if (SavesHandler.instance().loadData('score')) {
            this.score = new Text(`Score: ${SavesHandler.instance().loadData('score') as number}`, new TextStyle({
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

        SceneManager.moveCameraTo(new Point(0, 0));
    }

    protected initActions() {
        this.startButton.on('click', () => {
            this.startGame();
        });
    }

    public startGame(): void {
        SceneManager.changeScene(new Level1Scene());
    }

}
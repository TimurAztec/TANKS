import {Loader, Sprite, TextStyle, Text} from "pixi.js";
import {ISceneView} from "../interfaces";
import {SceneManager} from "../../scene-manager";
import {View} from "../view";
import {MenuScene} from "./menu-scene-controller";

export class MenuSceneView extends View implements ISceneView {

    // for making our loader graphics...
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
        this.startButton = new Sprite(Loader.shared.resources['button'].texture);
        this.scoreButton = new Sprite(Loader.shared.resources['button_scores'].texture);

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
            (this.controller as MenuScene).startGame();
        });
    }

    public update(dt: number): void {

    }
}
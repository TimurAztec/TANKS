import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import {EventManager} from "../../event-manager";
import {MenuScene} from "./menu-scene";
import {SavesHandler} from "../../utils/saves-handler";
import {IEventListener} from "../../utils/events/IEventListener";
import {Constants} from "../../constants";

class PauseScene extends Scene implements IEventListener {

    protected _background: Sprite;
    protected _menuStartButton: Sprite;
    protected _menuExitButton: Sprite;
    protected _menuText: Text;
    protected _parentScene: Scene;

    constructor() {
        super();

        EventManager.instance().subscribe('keydown', this);

        this.initVisuals();
        this.initActions();
        SceneManager.moveCameraTo(new Point(0, 0));
    }

    protected initVisuals(): void {
        this._background = new Sprite(Loader.shared.resources[Constants.AssetsTextures.MENU_BG].texture);
        this._background.anchor.set(0.5);
        this._background.x = SceneManager.width / 2;
        this._background.y = SceneManager.height / 2;
        this._background.width = SceneManager.width;
        this._background.height = SceneManager.height;
        this._menuText = new Text('Pause', new TextStyle({
            fontSize: 64,
            align: "center",
            fill: "#FFFFFF",
        }));
        this._menuStartButton = new Sprite(Loader.shared.resources[Constants.AssetsTextures.BUTTON_PLAY].texture);
        this._menuText.anchor.set(0.5);
        this._menuText.x = SceneManager.width / 2;
        this._menuText.y = SceneManager.height / 3;

        this._menuStartButton.anchor.set(0.5);
        this._menuStartButton.x = SceneManager.width / 2;
        this._menuStartButton.y = SceneManager.height / 2;
        this._menuStartButton.interactive = true;
        this._menuStartButton.buttonMode = true;

        this._menuExitButton = new Sprite(Loader.shared.resources[Constants.AssetsTextures.BUTTON_EXIT].texture);
        this._menuExitButton.anchor.set(0.5);
        this._menuExitButton.x = SceneManager.width / 2;
        this._menuExitButton.y = SceneManager.height / 1.5;
        this._menuExitButton.interactive = true;
        this._menuExitButton.buttonMode = true;
        this.addChild(this._background);
        this.addChild(this._menuStartButton);
        this.addChild(this._menuExitButton);
        this.addChild(this._menuText);
    }

    // you have same named function in at least 3 classes, better to move to abstract
    protected initActions(): void {
        this._menuStartButton.on('click', () => {
            this.resumeParentScene();
        });
        this._menuExitButton.on('click', () => {
            this.exit();
        });
    }

    public setParentScene(scene: Scene): PauseScene {
        this._parentScene = scene;
        this._parentScene.pause();
        return this;
    }

    public onEvent(event: string, data: any): void {
        if (!this.paused) {
            if (event == 'keydown' && data == 'Escape') {
                this.resumeParentScene();
            }
        }
    }

    protected resumeParentScene(): void {
        SceneManager.changeScene(this._parentScene);
        this._parentScene.resume();
        EventManager.instance().unsubscribe('keydown', this);
        this.destroy();
    }

    protected exit(): void {
        SavesHandler.instance().saveData('score', 0);
        SceneManager.changeScene(new MenuScene());
        EventManager.instance().unsubscribe('keydown', this);
        this.destroy();
    }
}

export { PauseScene }
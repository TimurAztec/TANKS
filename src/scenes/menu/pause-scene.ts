import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Point, Sprite, Text, TextStyle} from "pixi.js";
import {EventManager} from "../../event-manager";
import {IEventListener} from "../../ustils/events/IEventListener";

class PauseScene extends Scene implements IEventListener {

    protected _background: Sprite;
    protected _menuStartButton: Sprite;
    protected _menuText: Text;
    protected _parentScene: Scene;

    constructor() {
        super();

        EventManager.subscribe('keydown', this);

        this.initVisuals();
        this.initActions();
        SceneManager.moveCameraTo(new Point(0, 0));
    }

    protected initVisuals(): void {
        this._background = new Sprite(Loader.shared.resources['menu_background'].texture);
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
        this._menuStartButton = new Sprite(Loader.shared.resources['button_play'].texture);
        this._menuText.anchor.set(0.5);
        this._menuText.x = SceneManager.width / 2;
        this._menuText.y = SceneManager.height / 3;

        this._menuStartButton.anchor.set(0.5);
        this._menuStartButton.x = SceneManager.width / 2;
        this._menuStartButton.y = SceneManager.height / 2;
        this._menuStartButton.interactive = true;
        this._menuStartButton.buttonMode = true;
        this.addChild(this._background);
        this.addChild(this._menuStartButton);
        this.addChild(this._menuText);
    }

    protected initActions(): void {
        this._menuStartButton.on('click', () => {
            this.resumeParentScene();
        });
    }

    public setParentScene(scene: Scene): PauseScene {
        this._parentScene = scene;
        this._parentScene.pause();
        return this;
    }

    public onEvent(event: string, data: any): void {
        if (!this.paused) {
            if (event == 'keydown' && typeof data == 'string' && data == 'Escape') {
                this.resumeParentScene();
            }
        }
    }

    protected resumeParentScene(): void {
        SceneManager.changeScene(this._parentScene);
        this._parentScene.resume();
        EventManager.unsubscribe('keydown', this);
        this.destroy();
    }
}

export { PauseScene }
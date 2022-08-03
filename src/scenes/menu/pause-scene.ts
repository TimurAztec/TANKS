import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {Loader, Sprite, Text, TextStyle} from "pixi.js";
import {EventManager} from "../../event-manager";
import {IEventListener} from "../../ustils/events/IEventListener";

class PauseScene extends Scene implements IEventListener {

    protected _menuStartButton: Sprite;
    protected _menuText: Text;
    protected _parentScene: Scene;

    constructor() {
        super();

        EventManager.subscribe('keydown', this);

        this.initVisuals();
        this.initActions();
    }

    protected initVisuals(): void {
        this._menuText = new Text('Pause', new TextStyle({
            fontSize: 42,
            align: "center",
            fill: "#754c24",
        }));
        this._menuStartButton = new Sprite(Loader.shared.resources['button'].texture);
        this._menuText.anchor.set(0.5);
        this._menuText.x = SceneManager.width / 2;
        this._menuText.y = SceneManager.height / 3;

        this._menuStartButton.anchor.set(0.5);
        this._menuStartButton.x = SceneManager.width / 2;
        this._menuStartButton.y = SceneManager.height / 2;
        this._menuStartButton.interactive = true;
        this._menuStartButton.buttonMode = true;
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
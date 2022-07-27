import {Loader, Sprite} from "pixi.js";
import {ISceneView} from "../interfaces";
import {SceneManager} from "../../scene-manager";
import {View} from "../view";

export class LoaderSceneView extends View implements ISceneView {

    // for making our loader graphics...
    protected loaderBar: Sprite;
    protected loaderBarMask: Sprite;
    protected loaderBarBg: Sprite;
    protected progress: number;

    public initLoader(): void {
        this.loaderBarBg = new Sprite(Loader.shared.resources['loader_bg'].texture);
        this.loaderBarMask = new Sprite(Loader.shared.resources['loader_bg'].texture);
        this.loaderBar = new Sprite(Loader.shared.resources['loader_bar'].texture);

        this.loaderBarBg.anchor.set(0.5);
        this.loaderBarBg.x = SceneManager.width / 2;
        this.loaderBarBg.y = SceneManager.height / 2;

        this.loaderBar.anchor.set(0.5);
        this.loaderBar.x = SceneManager.width / 2;
        this.loaderBar.y = SceneManager.height / 2;

        this.loaderBarMask.x = this.loaderBar.x - this.loaderBar.width/2;
        this.loaderBarMask.y = this.loaderBar.y - this.loaderBar.height/2;
        this.loaderBarMask.isSprite = false;
        this.loaderBar.mask = this.loaderBarMask;

        this.addChild(this.loaderBarBg);
        this.addChild(this.loaderBar);
        this.addChild(this.loaderBarMask);
    }

    public updateProgress(progress: number): void {
        this.progress = progress;
    }

    public update(dt: number): void {
        if (this.loaderBarMask) {
            this.loaderBarMask.width = this.loaderBar.width * this.progress;
        }
    }
}
import {Loader, LoaderResource, Sprite} from "pixi.js";
import type { Dict } from '@pixi/utils';
import {Scene} from "../scene";
import {SceneManager} from "../../scene-manager";
import {MenuScene} from "../menu/menu-scene";
import {assets, loaderAssets} from "../../assets-list";
import { Assets, LoaderAssets } from "../../assets-vars";

export class LoaderScene extends Scene {

    protected loaderBar: Sprite;
    protected loaderBarMask: Sprite;
    protected loaderBarBg: Sprite;

    constructor() {
        super()
        Loader.shared.add(loaderAssets);
        Loader.shared.load((loader: Loader, resources: Dict<LoaderResource>) => {
            this.initLoader();

            Loader.shared.add(assets);
            Loader.shared.onProgress.add(this.loaderProgress, this);
            Loader.shared.onComplete.once(this.gameLoaded, this);
            Loader.shared.load();
        });

    }

    public initLoader(): void {
        this.loaderBarBg = new Sprite(Loader.shared.resources[LoaderAssets.Loaders.LOADER_BACKGROUND].texture);
        this.loaderBarMask = new Sprite(Loader.shared.resources[LoaderAssets.Loaders.LOADER_BACKGROUND].texture);
        this.loaderBar = new Sprite(Loader.shared.resources[LoaderAssets.Loaders.LOADER_BAR].texture);

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

    private loaderProgress(loader: Loader): void {
        this.loaderBarMask.width = this.loaderBar.width * (loader.progress / 100);
    }

    private gameLoaded(): void {
        SceneManager.changeScene(new MenuScene());
        this.destroy();
    }
}
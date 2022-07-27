import {Loader, LoaderResource} from "pixi.js";
import type { Dict } from '@pixi/utils';
import {Scene} from "../scene";
import {ISceneView} from "../interfaces";
import {LoaderSceneView} from "./loader-scene-view";
import {SceneManager} from "../../scene-manager";
import {MenuScene} from "../menu/menu-scene-controller";
import {MenuSceneView} from "../menu/menu-scene-view";
// @ts-ignore
import {assets, loaderAssets} from "../../../assets/assets";

export class LoaderScene extends Scene {

    public get view(): LoaderSceneView {
        return this._view as LoaderSceneView;
    }

    constructor(view: ISceneView) {
        super(view);
        Loader.shared.add(loaderAssets);
        Loader.shared.load((loader: Loader, resources: Dict<LoaderResource>) => {
            this.view.initLoader();

            Loader.shared.add(assets);
            Loader.shared.onProgress.add(this.loaderProgress, this);
            Loader.shared.onComplete.once(this.gameLoaded, this);
            Loader.shared.load();
        });

    }

    private loaderProgress(loader: Loader): void {
        this.view.updateProgress(loader.progress / 100);
    }

    private gameLoaded(): void {
        // Change scene to the game scene!
        SceneManager.changeScene(new MenuScene(new MenuSceneView()));
    }
}
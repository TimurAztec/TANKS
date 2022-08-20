import {SceneManager} from "./scene-manager";
import * as PIXI from "pixi.js";
import {LoaderScene} from "./scenes/loader/loader-scene";
import {ClientInputHandler} from "./utils/input/client-input-handler";

SceneManager.initialize(1024, 768);
ClientInputHandler.init();

const loader: LoaderScene = new LoaderScene();
SceneManager.changeScene(loader);

SceneManager.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
window.onresize = (e) => {
    SceneManager.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

// @ts-ignore
window['PIXI'] = PIXI;
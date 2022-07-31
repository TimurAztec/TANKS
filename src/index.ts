import {SceneManager} from "./scene-manager";
import * as PIXI from "pixi.js";
import {LoaderScene} from "./scenes/loader/loader-scene";
import {ClientInputHandler} from "./ustils/input/client-input-handler";

SceneManager.initialize(1024, 768);
ClientInputHandler.init();

const loader: LoaderScene = new LoaderScene();
SceneManager.changeScene(loader);

// @ts-ignore
window['PIXI'] = PIXI;
import {SceneManager} from "./scene-manager";
import * as PIXI from "pixi.js";
import {LoaderScene} from "./scenes/loader/loader-scene-controller";
import {LoaderSceneView} from "./scenes/loader/loader-scene-view";

SceneManager.initialize(1024, 768);

const loader: LoaderScene = new LoaderScene(new LoaderSceneView());
SceneManager.changeScene(loader);

// @ts-ignore
window['PIXI'] = PIXI;
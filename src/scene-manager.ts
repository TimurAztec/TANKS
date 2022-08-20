import { Application } from "@pixi/app";
import { Point } from "pixi.js";
import {Scene} from "./scenes/scene";

export class SceneManager {
    private constructor() {}

    private static _app: Application;
    private static _currentScene: Scene;
    private static _cameraPos: Point = new Point(0, 0);

    private static _width: number;
    private static _height: number;

    private static _lastTick: number = 0;


    public static get width(): number {
        return SceneManager._width;
    }
    public static get height(): number {
        return SceneManager._height;
    }
    public static get currentScene(): Scene {
        return SceneManager._currentScene;
    }

    // Use this function ONCE to start the entire game
    public static initialize(width: number, height: number): void {
        if (!this._app) {
            SceneManager._width = width;
            SceneManager._height = height;

            // Create our pixi app
            SceneManager._app = new Application({
                view: document.getElementById("game-canvas") as HTMLCanvasElement,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                backgroundColor: 0x112233,
                width: width,
                height: height
            });

            requestAnimationFrame(this.tick.bind(this));
        }
    }

    public static resize(width: number, height: number): void {
        if (SceneManager._currentScene) {
            SceneManager._app.renderer.resize((height + height/3), height);
            SceneManager._currentScene.scale.set((height + height/3)/SceneManager.width, height/SceneManager.height);
        }
    }

    // Call this function when you want to go to a new scene
    public static changeScene(scene: Scene): void {
        if (SceneManager._currentScene) {
            SceneManager._currentScene.visible = false;
            // SceneManager._currentScene.destroy();
            // SceneManager._app.stage.removeChild(SceneManager._currentScene.view);
        }

        // Add the new one
        SceneManager._currentScene = scene;

        SceneManager._currentScene.scale.set((SceneManager._app.renderer.height + SceneManager._app.renderer.height/3)/SceneManager.width,
            SceneManager._app.renderer.height/SceneManager.height);

        if (!SceneManager._app.stage.children.includes(SceneManager._currentScene)) {
            SceneManager._app.stage.addChild(SceneManager._currentScene);
        }
        SceneManager._currentScene.visible = true;
    }

    public static moveCameraTo(position: Point): void {
        SceneManager._cameraPos = new Point().copyFrom(position);
    }

    private static tick(): void {
        let newTick = Date.now();
        let deltaTime = newTick - this._lastTick;
        this._lastTick = newTick;
        if (deltaTime < 0) deltaTime = 0;
        if (deltaTime > 1000) deltaTime = 1000;
        let deltaFrame = deltaTime * 60 / 1000; //1.0 is for single frame

        SceneManager.update(deltaFrame);
        requestAnimationFrame(this.tick.bind(this));
    }

    private static update(dt: number): void {
        if (SceneManager._currentScene) {
            SceneManager._currentScene.position.x = -SceneManager._cameraPos.x;
            SceneManager._currentScene.position.y = -SceneManager._cameraPos.y;
            SceneManager._currentScene.update(dt);
        }
    }
}
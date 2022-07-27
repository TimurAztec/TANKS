import { Application } from "@pixi/app";
import {Scene} from "./scenes/scene";

export class SceneManager {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    private static _app: Application;
    private static _currentScene: Scene;

    // Width and Height are read-only after creation (for now)
    private static _width: number;
    private static _height: number;

    private static _lastTick: number = 0;


    // With getters but not setters, these variables become read-only
    public static get width(): number {
        return SceneManager._width;
    }
    public static get height(): number {
        return SceneManager._height;
    }

    // Use this function ONCE to start the entire machinery
    public static initialize(width: number, height: number): void {

        // store our width and height
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

    // Call this function when you want to go to a new scene
    public static changeScene(newScene: Scene): void {
        // Remove and destroy old scene... if we had one..
        if (SceneManager._currentScene) {
            // SceneManager._app.stage.removeChild(SceneManager._currentScene.view);
            SceneManager._currentScene.view.destroy();
        }

        // Add the new one
        SceneManager._currentScene = newScene;
        SceneManager._app.stage.addChild(SceneManager._currentScene.view);
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

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(dt: number): void {
        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (SceneManager._currentScene) {
            SceneManager._currentScene.view.update(dt);
        }

        // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
    }
}
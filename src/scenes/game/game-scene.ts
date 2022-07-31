import {Scene} from "../scene";
import {Entity} from "../../entities/entity";

import * as level1 from './levels/level1.json';
import {Tank} from "../../entities/interactive/tank";
import {PlayerControlBehavior} from "../../entities/behaviors/control/player-control-behavior";
import {IEventListener} from "../../ustils/events/IEventListener";
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {Container, Loader, Sprite, Text, TextStyle} from "pixi.js";
import {GameSceneState} from "./game-scene-state";
import {GameSceneStateGame} from "./game-scene-state-game";

export class GameScene extends Scene implements IEventListener{

    tank: Tank;

    protected _state: GameSceneState;

    public pauseMenu: Container;
    protected _menuStartButton: Sprite;
    protected _menuText: Text;

    public set state(value: GameSceneState) {
        this._state = value;
    }

    constructor() {
        super();

        this.tank = new Tank();
        this.tank.setSkin({
            assetName: 'tank'
        });
        this.tank.controlBehavior = new PlayerControlBehavior();
        this.tank.x = 300;
        this.tank.y = 300;
        this.addChild(this.tank);

        this.initPauseMenu();

        EventManager.subscribe('keydown', this);
        this.state = new GameSceneStateGame(this);
    }

    protected loadLevel(level: any): void {
        
    }

    protected initPauseMenu(): void {
        this.pauseMenu = new Container();
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
        this._menuStartButton.on('click', () => { if (this._state) this._state.pausePressed() });
        this.pauseMenu.addChild(this._menuText);
        this.pauseMenu.addChild(this._menuStartButton);
        this.addChild(this.pauseMenu);
    }

    public onEvent(event: string, data: any): void {
        if (event == 'keydown' && typeof data == 'string' && data == 'Escape') {
           this._state.pausePressed();
        }
    }

    public update(dt: number) {
        super.update(dt);
        this._state.update(dt);
    }
}
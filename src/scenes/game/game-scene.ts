import {Scene} from "../scene";
import {Entity} from "../../entities/entity";

import * as level1 from './levels/level1.json';
import {Tank} from "../../entities/interactive/tank";
import {PlayerControlBehavior} from "../../entities/behaviors/control/player-control-behavior";
import {IEventListener} from "../../ustils/events/IEventListener";
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {Container, DisplayObject, Loader, Sprite, Text, TextStyle} from "pixi.js";
import {TILE_SIZE, TilesFactory} from "../../entities/tiles/tiles-factory";
import {PauseScene} from "../menu/pause-scene";

export class GameScene extends Scene implements IEventListener {

    tank: Tank;

    constructor() {
        super();

        EventManager.subscribe('keydown', this);

        this.loadLevel(level1);
    }

    protected loadLevel(level: any): void {
        let x: number = TILE_SIZE/2;
        let y: number = TILE_SIZE/2;
        for (let row of level.tilemap) {
            for (let tileIndex of row) {
                let tile: Entity = TilesFactory.getTile(tileIndex);
                if (tile) {
                    tile.width = TILE_SIZE;
                    tile.height = TILE_SIZE;
                    tile.x = x;
                    tile.y = y;
                    this.addChild(tile);
                }
                x += TILE_SIZE;
            }
            x = TILE_SIZE/2;
            y += TILE_SIZE;
        }

        this.tank = new Tank();
        this.tank.setSkin({
            assetName: 'tank'
        });
        this.tank.controlBehavior = new PlayerControlBehavior();
        this.tank.x = 300;
        this.tank.y = 300;
        this.addChild(this.tank);
    }

    public onEvent(event: string, data: any): void {
        if (!this.paused) {
            if (event == 'keydown' && typeof data == 'string' && data == 'Escape') {
                SceneManager.changeScene(new PauseScene().setParentScene(this));
            }
        }
    }

    public update(dt: number) {
        super.update(dt);
        this.children.forEach((entity: DisplayObject) => {
            (entity as Entity).update(dt);
            (entity as Entity).checkCollisions(this.children as Entity[]);
        });
    }
}
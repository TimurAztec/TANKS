import {Scene} from "../scene";
import {Entity} from "../../entities/entity";

import * as level1 from './levels/level1.json';
import {IEventListener} from "../../ustils/events/IEventListener";
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {DisplayObject} from "pixi.js";
import {TILE_SIZE, TilesFactory} from "../../entities/tiles/tiles-factory";
import {PauseScene} from "../menu/pause-scene";

export class GameScene extends Scene implements IEventListener {

    constructor() {
        super();

        EventManager.subscribe('keydown', this);

        this.loadLevel(level1);
    }

    protected loadLevel(level: LevelData): void {
        for (let [zindex, tilemap] of level.depthLevels.entries()) {
            let x: number = TILE_SIZE/2;
            let y: number = TILE_SIZE/2;
            for (let row of tilemap) {
                for (let tileIndex of row) {
                    let tile: Entity = TilesFactory.getTile(tileIndex);
                    if (tile) {
                        tile.x = x;
                        tile.y = y;
                        tile.zIndex = zindex;
                        this.addChild(tile);
                    }
                    x += TILE_SIZE;
                }
                x = TILE_SIZE / 2;
                y += TILE_SIZE;
            }
        }
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
        });
    }
}
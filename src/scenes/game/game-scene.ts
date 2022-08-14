import {Scene} from "../scene";
import {Entity} from "../../entities/entity";

import * as level1 from './levels/level1.json';
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {PauseScene} from "../menu/pause-scene";
import {EntityFactory, TILE_SIZE} from "../../entities/entity-factory";
import {IEventListener} from "../../utils/events/IEventListener";
import {AbstractCollisionComponent} from "../../entities/behaviors/collision/abstract-collision-component";
import {AABB} from "../../utils/utils";

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
                    let tile: Entity = EntityFactory.getTile(tileIndex);
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
        let i: number = this.children.length;
        while (i--) {
            (this.children[i] as Entity).update(dt);
            const collision = (this.children[i] as Entity).getComponent(AbstractCollisionComponent);
            if (collision) {
                let j: number = this.children.length;
                while (j--) {
                    if (this.children[i] !== this.children[j] &&
                        AABB({
                            x: (this.children[i] as Entity).x,
                            y: (this.children[i] as Entity).y,
                            width: (this.children[i] as Entity).width,
                            height: (this.children[i] as Entity).height
                        }, {
                            x: (this.children[j] as Entity).x,
                            y: (this.children[j] as Entity).y,
                            width: (this.children[j] as Entity).width,
                            height: (this.children[j] as Entity).height
                        })) {
                        collision.collidedWith(this.children[j] as Entity);
                        j = 0;
                    }
                }
            }
        }
    }
}
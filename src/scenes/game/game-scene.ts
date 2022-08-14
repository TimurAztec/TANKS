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
import {DisplayObject} from "pixi.js";

export class GameScene extends Scene implements IEventListener {

    public dynamicChildren: Entity[] = [];

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
        console.log(dt);

        this.dynamicChildren = this.dynamicChildren.filter((entity) => {
            return !entity.destroyed
        });
        let i: number = this.dynamicChildren.length;
        while (i--) {
            this.dynamicChildren[i].update(dt);
            const collision = this.dynamicChildren[i].getComponent(AbstractCollisionComponent);
            if (collision) {
                let group: Entity[] = collision.getCollisionGroup();
                let j: number = group.length;
                while (j--) {
                    if (this.dynamicChildren[i] !== group[j] &&
                        AABB(this.dynamicChildren[i].simpleBounds, group[j].simpleBounds)) {
                        collision.collidedWith(group[j]);
                        j = 0;
                    }
                }
            }
        }
    }

    addChild<U extends DisplayObject[]>(...children: U): U[0] {
        this.dynamicChildren = [...this.dynamicChildren,
            ...[...children].filter((child: any) => child.getComponent(AbstractCollisionComponent)) as Entity[]];
        return super.addChild(...children);
    }
}
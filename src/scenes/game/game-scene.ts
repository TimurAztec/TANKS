import {Scene} from "../scene";
import {Entity} from "../../entities/entity";
import * as level1 from './levels/level1.json';
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {PauseScene} from "../menu/pause-scene";
import {EntityFactory, TILE_SIZE} from "../../entities/entity-factory";
import {IEventListener} from "../../utils/events/IEventListener";
import {AbstractCollisionComponent} from "../../entities/behaviors/collision/abstract-collision-component";
import {DisplayObject, Point} from "pixi.js";
import { MenuScene } from "../menu/menu-scene";

export class GameScene extends Scene implements IEventListener {

    public dynamicChildren: Entity[] = [];
    public tileMap: (Entity | undefined)[][][] = [];

    protected _preUpdateAction: Function = () => {};

    constructor() {
        super();

        EventManager.subscribe('keydown', this);
        EventManager.subscribe('entity_moved_from_tile_to_tile', this);
        EventManager.subscribe('team_lost', this);

        this.loadLevel(level1);
    }

    protected loadLevel(level: LevelData): void {
        this.tileMap.length = 0;
        for (let [zindex, tilemap] of level.depthLevels.entries()) {
            if (!this.tileMap.length) { this.tileMap = new Array(tilemap.length); }
            let x: number = TILE_SIZE/2;
            let y: number = TILE_SIZE/2;
            for (let [rowIndex, row] of tilemap.entries()) {
                if (!this.tileMap[rowIndex]) this.tileMap[rowIndex] = [];
                for (let [tileIndex, tileID] of row.entries()) {
                    if (!this.tileMap[rowIndex][tileIndex]) this.tileMap[rowIndex][tileIndex] = [];
                    let tile: Entity = EntityFactory.getTile(tileID);
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
        SceneManager.moveCameraTo(new Point(12, 12));
    }

    public onEvent(event: string, data: any): void {
        if (!this.paused) {
            if (event == 'keydown' && typeof data == 'string' && data == 'Escape') {
                this._preUpdateAction = () => {
                    SceneManager.changeScene(new PauseScene().setParentScene(this));
                    this._preUpdateAction = () => {};
                }
            }
            if (event == 'entity_moved_from_tile_to_tile') {
                this._preUpdateAction = () => {
                    this.moveEntityFromTileToTile(data.entity, data.from, data.to);
                    this._preUpdateAction = () => {};
                }
            }
            if (event == 'team_lost') {
                this._preUpdateAction = () => {
                    this.pause();
                    this.dynamicChildren.length = 0;
                    this.tileMap.length = 0;
                    SceneManager.changeScene(new MenuScene());
                    this.destroy();
                    this._preUpdateAction = () => {};
                }
            }
        }
    }

    public update(dt: number) {
        this._preUpdateAction();
        super.update(dt);
        // console.log(dt);

        this.dynamicChildren = this.dynamicChildren.filter((entity) => {
            return !entity.destroyed
        });
        let i: number = this.dynamicChildren.length;
        while (i--) {
            this.dynamicChildren[i].update(dt);
        }
    }

    public addChild<U extends DisplayObject[]>(...children: U): U[0] {
        this.dynamicChildren = [...this.dynamicChildren,
            ...[...children].filter((child: any) => child.getComponent(AbstractCollisionComponent)) as Entity[]];
        for (const child of [...children] as Entity[]) {
            const pos = child.tilePosition;
            this.tileMap[pos.y][pos.x].push(child);
        }
        return super.addChild(...children);
    }

    public removeChild<U extends DisplayObject[]>(...children: U): U[0] {
        for (const child of [...children] as Entity[]) {
            const pos = child.tilePosition;
            const index = this.tileMap[pos.y][pos.x].indexOf(child);
            this.tileMap[pos.y][pos.x].splice(index, 1);
        }
        return super.removeChild(...children);
    }

    protected moveEntityFromTileToTile(entity: Entity, from: Point, to: Point): void {
        const index = this.tileMap[from.y][from.x].indexOf(entity);
        if (!this.tileMap[to.y] || !this.tileMap[to.y][to.x]) return;
        if (index >= 0) {
            this.tileMap[to.y][to.x].push(this.tileMap[from.y][from.x].splice(index, 1)[0]);
        } else {
            let i: number = this.tileMap.length;
            while(i--) {
                let j: number = this.tileMap[i].length;
                while(j--) {
                    const findex = this.tileMap[i][j].indexOf(entity);
                    if (findex >= 0) {
                        this.tileMap[to.y][to.x].push(this.tileMap[i][j].splice(findex, 1)[0]);
                        i = j = 0;
                    }
                }
            }
        }
    }
}
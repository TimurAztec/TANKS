import {Scene} from "../scene";
import {Entity} from "../../entities/entity";
import * as level1 from './levels/level1.json';
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {PauseScene} from "../menu/pause-scene";
import {EntityFactory} from "../../entities/entity-factory";
import {IEventListener} from "../../utils/events/IEventListener";
import {DisplayObject, Point} from "pixi.js";
import { MenuScene } from "../menu/menu-scene";
import { AbstractMovementComponent } from "../../entities/behaviors/movement/abstract-movement-component";
import { getTitlePosition } from "../../utils/utils";

export class GameScene extends Scene implements IEventListener {

    public dynamicChildren: Entity[] = [];
    public tileMap: (Entity | undefined)[][][] = [];
    
    public readonly tileSize: number = 36;

    constructor() {
        super();

        EventManager.subscribe('keydown', this);
        EventManager.subscribe('team_lost', this);

        this.loadLevel(level1);
    }

    protected loadLevel(level: LevelData): void {
        this.tileMap.length = 0;
        for (let [zindex, tilemap] of level.depthLevels.entries()) {
            if (!this.tileMap.length) { this.tileMap = new Array(tilemap.length); }
            let x: number = this.tileSize/2;
            let y: number = this.tileSize/2;
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
                    x += this.tileSize;
                }
                x = this.tileSize / 2;
                y += this.tileSize;
            }
        }
        SceneManager.moveCameraTo(new Point(12, 12));
    }

    public onEvent(event: string, data: any): void {
        if (!this.paused) {
            if (event == 'keydown' && typeof data == 'string' && data == 'Escape') {
                this._preUpdateAction = () => {
                    console.log(this.tileMap);
                    SceneManager.changeScene(new PauseScene().setParentScene(this));
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

    // Забирает как то Тимур Дениса с интернатруры. Идут они по улице, Денис говорит "Тимур, а почему солнышко светит?"
    // Тимур отвечает ему "Работает и х*й с ним, не трогай"
    // Так и с кодом ниже
    public update(dt: number) {
        super.update(dt);
        // console.log(dt);

        this.dynamicChildren = this.dynamicChildren.filter((entity) => {
            return !entity.destroyed
        });
        let i: number = this.dynamicChildren.length;
        while (i--) {
            const dynamicEntity = this.dynamicChildren[i];
            if (dynamicEntity.getComponent(AbstractMovementComponent) &&
                !dynamicEntity.position.equals(dynamicEntity.getComponent(AbstractMovementComponent).previousPosition)) {
                const prevTilePos = getTitlePosition(dynamicEntity.getComponent(AbstractMovementComponent).previousPosition, this.tileSize);
                const tilePos = getTitlePosition(dynamicEntity.position, this.tileSize);
                this.moveEntityFromTileToTile(dynamicEntity, prevTilePos, tilePos);
            }
            dynamicEntity.updateTilingData(this.tileMap, this.tileSize);
            dynamicEntity.update(dt);
        }
    }

    public addChild<U extends DisplayObject[]>(...children: U): U[0] {
        this.dynamicChildren = [...this.dynamicChildren,
            ...[...children].filter((child: any) => child.getComponent(AbstractMovementComponent)) as Entity[]];
        for (const child of [...children] as Entity[]) {
            const pos = getTitlePosition(child.position, this.tileSize);
            this.tileMap[pos.y][pos.x].push(child);
        }
        return super.addChild(...children);
    }

    public removeChild<U extends DisplayObject[]>(...children: U): U[0] {
        for (const child of [...children] as Entity[]) {
            const pos = getTitlePosition(child.position, this.tileSize);
            if (this.tileMap[pos.y] && this.tileMap[pos.y][pos.x]) {
                const index = this.tileMap[pos.y][pos.x].indexOf(child);
                this.tileMap[pos.y][pos.x].splice(index, 1);
            } else {
                let i: number = this.tileMap.length;
                while(i--) {
                    let j: number = this.tileMap[i].length;
                    while(j--) {
                        const index = this.tileMap[i][j].indexOf(child);
                        if (index >= 0) {
                            this.tileMap[i][j].splice(index, 1);
                            i = j = 0;
                        }
                    }
                }
            }
        }
        return super.removeChild(...children);
    }

    protected moveEntityFromTileToTile(entity: Entity, from: Point, to: Point): void {
        if (!this.tileMap[from.y] || !this.tileMap[from.y][from.x]) return;
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
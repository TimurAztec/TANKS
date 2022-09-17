import {Scene} from "../scene";
import {EventManager} from "../../event-manager";
import {SceneManager} from "../../scene-manager";
import {PauseScene} from "../menu/pause-scene";
import {IEventListener} from "../../utils/events/IEventListener";
import {DisplayObject, Point} from "pixi.js";
import { getTitlePosition } from "../../utils/utils";
import { Entity } from "./entities/entity";
import { AbstractMovementComponent } from "./entities/behaviors/movement/abstract-movement-component";
import { EntityFactory } from "./entities/entity-factory";

export abstract class GameScene extends Scene implements IEventListener {

    public dynamicChildren: Entity[] = [];
    public tileMap: (Entity | undefined)[][][] = [];

    public readonly tileSize: number = 36;

    constructor() {
        super();

        EventManager.instance().subscribe('keydown', this);
    }

    protected loadLevel(level: LevelData): void {
        this.tileMap = [];
        for (let [zindex, tilemap] of level.depthLevels.entries()) {
            if (!this.tileMap.length) { this.tileMap = new Array(tilemap.length); }
            let x: number = this.tileSize/2;
            let y: number = this.tileSize/2;
            for (let [rowIndex, row] of tilemap.entries()) {
                if (!this.tileMap[rowIndex]) this.tileMap[rowIndex] = [];
                for (let [tileIndex, tileID] of row.entries()) {
                    if (!this.tileMap[rowIndex][tileIndex]) this.tileMap[rowIndex][tileIndex] = [];
                    let tile: Entity = EntityFactory.getEntity(tileID);
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
            if (event == 'keydown' && data == 'Escape') {
                this._preUpdateAction = () => {
                    SceneManager.changeScene(new PauseScene().setParentScene(this));
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

        this.dynamicChildren = this.dynamicChildren.filter((entity) => {
            return !entity.destroyed
        });
        let i: number = this.dynamicChildren.length;
        while (i--) {
            const dynamicEntity = this.dynamicChildren[i];

            if (dynamicEntity.destroyed) continue;

            // you are calling getComponent function triple time, but can do it only once
            const movementComponent = dynamicEntity.getComponent(AbstractMovementComponent);
            if (movementComponent &&
                !dynamicEntity.position.equals(movementComponent.previousPosition)) {
                const prevTilePos = getTitlePosition(movementComponent.previousPosition, this.tileSize);
                const tilePos = getTitlePosition(dynamicEntity.position, this.tileSize);
                this.moveEntityFromTileToTile(dynamicEntity, prevTilePos, tilePos);
            }
            dynamicEntity.updateTilingData(this.tileMap, this.tileSize);
            dynamicEntity.update(dt);
        }
    }

    public addChild<U extends DisplayObject[]>(...children: U): U[0] {
        const childrenCopy: Entity[] = [...children] as Entity[];
        this.dynamicChildren.push(
            ...childrenCopy.filter((child: Entity) => child.getComponent(AbstractMovementComponent))
            );
        let canBeAdded = true;

        for (const child of childrenCopy) {
            const pos = getTitlePosition(child.position, this.tileSize);
            const row = this.tileMap[pos.y];
            const tile = this.tileMap[pos.y][pos.x];
            if (row && tile) {
                tile.push(child);
            } else {
                canBeAdded = false;
            }
        }
        if (canBeAdded) {
            return super.addChild(...childrenCopy);
        } else {
            for (const child of childrenCopy as Entity[]) {
                child.destroy();
            }
            return childrenCopy[0];
        }
    }

    public removeChild<U extends DisplayObject[]>(...children: U): U[0] {
        const childrenCopy: Entity[] = [...children] as Entity[];
        for (const child of childrenCopy) {
            const pos = getTitlePosition(child.position, this.tileSize);
            const row = this.tileMap[pos.y] ? this.tileMap[pos.y] : undefined;
            const tile = this.tileMap[pos.y][pos.x] ? this.tileMap[pos.y][pos.x] : undefined;
            if (row && tile) {
                const index = tile.indexOf(child);
                tile.splice(index, 1);
            } else {
                rmark: for (const [i, row] of this.tileMap.entries()) {
                    for (const [j, tile] of row.entries()) {
                        const findex = tile.indexOf(child);
                        if (findex >= 0) {
                            this.tileMap[i][j].splice(findex, 1);
                            break rmark;
                        }
                    }
                }
            }
        }
        return super.removeChild(...children);
    }

    protected moveEntityFromTileToTile(entity: Entity, from: Point, to: Point): void {
        let index = -1;
        const fromTile = this.tileMap[from.y] ? this.tileMap[from.y][from.x] : undefined;
        const toTile = this.tileMap[to.y] ? this.tileMap[to.y][to.x] : undefined;
        if (!toTile) return;
        if (fromTile) {
            index = fromTile.indexOf(entity);
        }
        if (index >= 0) {
            toTile.push(fromTile.splice(index, 1)[0]);
        } else {
            rmark: for (const row of this.tileMap) {
                for (const tile of row) {
                    const findex = tile.indexOf(entity);
                    if (findex >= 0) {
                        toTile.push(tile.splice(findex, 1)[0]);
                        break rmark;
                    }
                }
            }
        }
    }
}
import {RandomControlComponent} from "../../behaviors/control/random-control-component";
import {DirectionalWalkMovementBehavior} from "../../behaviors/movement/direct-walk-movement-component";
import { AmountBasedSpawner } from "./amount-based-spawner";
import {AbstractControlComponent} from "../../behaviors/control/abstract-control-component";
import {AbstractMovementComponent} from "../../behaviors/movement/abstract-movement-component";
import {Point} from "pixi.js";
import {IComponent} from "../../behaviors/IComponent";
import {BasicAabbCollisionComponent} from "../../behaviors/collision/basic-aabb-collision-component";
import {Entity} from "../../entity";
import { AbstractCollisionComponent } from "../../behaviors/collision/abstract-collision-component";
import {getTitlePosition, validatePointIsPositive} from "../../../../../utils/utils";
import { GameConstants } from "../../../game-constants";

class WanderingAmountBasedSpawner extends AmountBasedSpawner {

    constructor(source?: WanderingAmountBasedSpawner) {
        super(source);
        this.setComponent(new RandomControlComponent());
        this.setComponent(new DirectionalWalkMovementBehavior());
        this.setComponent(new BasicAabbCollisionComponent().onCollision((object: Entity) => {
            if (this._collisionGroup.includes(object.entityType)) {
                this._collides = true;
            }
        })
        .onCollidedWith(GameConstants.EntityTypes.HARD_WALL, () => {this.getComponent(AbstractMovementComponent).collides()}));
    }

    public setComponent(component: IComponent): void {
        super.setComponent(component);

        if (Object.getPrototypeOf(component) instanceof AbstractControlComponent) {
            this.getComponent(AbstractControlComponent).onActionUp(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, -1));
            });
            this.getComponent(AbstractControlComponent).onActionDown(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(0, 1));
            });
            this.getComponent(AbstractControlComponent).onActionRight(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(1, 0));
            });
            this.getComponent(AbstractControlComponent).onActionLeft(() => {
                this.getComponent(AbstractMovementComponent).setMovementVector(new Point(-1, 0));
            });
        }
    }

    public updateTilingData(tileMap: any[][], tileSize: number): void {
        const tilePos = getTitlePosition(this.position, tileSize);
        const vectorTilePos = getTitlePosition(this.getComponent(AbstractMovementComponent).rotationVector, tileSize);
        if (!tileMap || !validatePointIsPositive(tilePos) || !validatePointIsPositive(vectorTilePos)) return;
        const collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        const collisionGroupAdditionalTilesRelativePositions = [
            new Point(vectorTilePos.x,vectorTilePos.y),
            new Point(vectorTilePos.x - 1,vectorTilePos.y),
            new Point(vectorTilePos.x + 1,vectorTilePos.y),
            new Point(vectorTilePos.x,vectorTilePos.y - 1),
            new Point(vectorTilePos.x,vectorTilePos.y + 1),
        ]
        for (const additionalTilePos of collisionGroupAdditionalTilesRelativePositions) {
            if (tileMap[additionalTilePos.y] && tileMap[additionalTilePos.y][additionalTilePos.x]) {
                collisionGroup.push(...tileMap[additionalTilePos.y][additionalTilePos.x]);
            }
        }
        this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
    }
}

export { WanderingAmountBasedSpawner }
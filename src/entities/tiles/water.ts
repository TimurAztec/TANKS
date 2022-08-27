import { Assets } from "../../assets-vars";
import { getTitlePosition, validatePointIsPositive } from "../../utils/utils";
import { AbstractCollisionComponent } from "../behaviors/collision/abstract-collision-component";
import { BasicAabbCollisionComponent } from "../behaviors/collision/basic-aabb-collision-component";
import { AbstractControlComponent } from "../behaviors/control/abstract-control-component";
import { ProjectileMovementComponent } from "../behaviors/movement/projectile-movement-component";
import {Entity} from "../entity";

class Water extends Entity {
    protected _objectToDrown: Entity;

    constructor(source?: Water) {
        super(source);
        this.setSkin({ assetName: Assets.Tiles.WATER });
        this.setComponent(new ProjectileMovementComponent());
        this.setComponent(new BasicAabbCollisionComponent().onCollidedWith((object: Entity) => {
            if (object == this) return;
            switch (object.entityType) {
                case 'Tank':
                    this.drown(object);
                    break;
                case 'Tractor':
                    this.drown(object);
                    break;
                case 'Soldier':
                    this.drown(object);
                    break;
            }
        }));
    }

    protected drown(object: Entity): void {
        if (this._objectToDrown !== object && this._objectToDrown && !this._objectToDrown.destroyed) {
            this._objectToDrown.destroy();
            return;
        }
        this._objectToDrown = object;
        this._objectToDrown.x = this.x;
        this._objectToDrown.y = this.y;
        this._objectToDrown.removeComponent(AbstractControlComponent);
    }

    public updateTilingData(tileMap: any[][], tileSize: number): void {
        const tilePos = getTitlePosition(this.position, tileSize);
        if (!tileMap || !validatePointIsPositive(tilePos)) return;
        let collisionGroup = [...tileMap[tilePos.y][tilePos.x]];
        this.getComponent(AbstractCollisionComponent).setCollisionGroup(collisionGroup);
    }

    public update(dt: number): void {
        super.update(dt);
        if (this._objectToDrown && !this._objectToDrown.destroyed) {
            this._objectToDrown.scale.x = this._objectToDrown.scale.y -= 0.01;
            if (this._objectToDrown.scale.x <= 0) {
                this._objectToDrown.destroy();
            }
        }
    }

    public clone(): Water {
        return new Water(this);
    }

}

export { Water }
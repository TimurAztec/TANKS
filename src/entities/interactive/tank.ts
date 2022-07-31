import {Entity} from "../entity";
import {Loader, Sprite} from "pixi.js";
import {IControlBehavior} from "../behaviors/control/IControlBehavior";

class Tank extends Entity {
    protected _controlBehavior: IControlBehavior;

    public set controlBehavior(value: IControlBehavior) {
        this._controlBehavior = value;
        this._controlBehavior.onActionUp(() => {
            this.y -= 1;
            this.angle = 0;
        });
        this._controlBehavior.onActionDown(() => {
            this.y += 1;
            this.angle = 180;
        });
        this._controlBehavior.onActionRight(() => {
            this.x += 1;
            this.angle = 90;
        });
        this._controlBehavior.onActionLeft(() => {
            this.x -= 1;
            this.angle = 270;
        });
    }

    public setSkin(options?: any): void {
        this.skin = new Sprite(Loader.shared.resources[options.assetName].texture);
        super.setSkin();
    }

}

export { Tank }
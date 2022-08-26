import {Entity} from "../entity";
import {IDestroyOptions, Point} from "pixi.js";
import {SceneManager} from "../../scene-manager";
import {AppearFX} from "../fx/appear";
import {EventManager} from "../../event-manager";
import { IEventListener } from "../../utils/events/IEventListener";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";

class Base extends Entity implements IEventListener {

    constructor(source?: Base) {
        super(source);
    }

    public clone(): Base {
        return new Base(this);
    }

    public onEvent(event: string, data: any): void {}

    public destroy(options?: IDestroyOptions | boolean): void {
        super.destroy(options);
        if (this.getComponent(AbstractTeamComponent)) {
            EventManager.notify('team_lost', this.getComponent(AbstractTeamComponent).getTeam);
        }
    }
    
    public update(dt: number): void {
        if (this._initOnUpdate) {
            const fx = new AppearFX();
            fx.x = this.x;
            fx.y = this.y;
            SceneManager.currentScene.addChild(fx);
        }
        super.update(dt);
    }
}

export { Base }
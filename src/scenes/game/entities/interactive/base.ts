import {Entity} from "../entity";
import {IDestroyOptions} from "pixi.js";
import { AbstractTeamComponent } from "../behaviors/team/abstract-team-component";
import {IEventListener} from "../../../../utils/events/IEventListener";
import { SceneManager } from "../../../../scene-manager";
import { EventManager } from "../../../../event-manager";
import { AppearFX } from "../fx/appear";
import { GameConstants } from "../../game-constants";

class Base extends Entity implements IEventListener {

    constructor(source?: Base) {
        super(source);
    }

    public onEvent(event: string, data: any): void {}

    public destroy(options?: IDestroyOptions | boolean): void {
        super.destroy(options);
        if (this.getComponent(AbstractTeamComponent)) {
            EventManager.instance().notify(GameConstants.Events.GAME_OVER, this.getComponent(AbstractTeamComponent).getTeam);
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
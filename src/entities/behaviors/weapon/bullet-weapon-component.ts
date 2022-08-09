import {AbstractWeaponComponent} from "./abstract-weapon-component";
import {Bullet} from "../../interactive/bullet";
import {SceneManager} from "../../../scene-manager";
import {AbstractTeamComponent} from "../team/abstract-team-component";
import {BasicTeamComponent} from "../team/basic-team-component";

export class BulletWeaponComponent extends AbstractWeaponComponent {

    public fire(): void {
        if (!this._reloaded) return;
        super.fire();
        const bullet: Bullet = new Bullet();
        bullet.setSkin({assetName: 'bullet'});
        if (this._entity.getComponent(AbstractTeamComponent)) {
            bullet.setComponent(new BasicTeamComponent().setTeam(
                this._entity.getComponent(AbstractTeamComponent).getTeam()
            ));
        }
        bullet.x = this._entity.x;
        bullet.y = this._entity.y;
        SceneManager.currentScene.addChild(bullet);
        bullet.launch(this._entity.angle);
    }

}
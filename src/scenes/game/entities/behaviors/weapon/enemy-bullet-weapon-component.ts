import {AbstractWeaponComponent} from "./abstract-weapon-component";
import {Bullet} from "../../interactive/bullet";
import {AbstractTeamComponent} from "../team/abstract-team-component";
import {BasicTeamComponent} from "../team/basic-team-component";
import { Constants } from "../../../../../constants";
import { SceneManager } from "../../../../../scene-manager";

export class EnemyBulletWeaponComponent extends AbstractWeaponComponent {

    public fire(): void {
        if (!this._reloaded) return;
        super.fire();
        const bullet: Bullet = new Bullet();
        bullet.setSkin({assetName: Constants.AssetsTextures.BULLET_2});
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

    public clone(): EnemyBulletWeaponComponent { return new EnemyBulletWeaponComponent(this) }

}
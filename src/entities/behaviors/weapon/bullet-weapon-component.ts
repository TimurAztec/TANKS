import {AbstractWeaponComponent} from "./abstract-weapon-component";
import {Bullet} from "../../interactive/bullet";
import {SceneManager} from "../../../scene-manager";
import {AbstractTeamComponent} from "../team/abstract-team-component";
import {BasicTeamComponent} from "../team/basic-team-component";
import { Assets } from "../../../assets-vars";
import { AbstractMovementComponent } from "../movement/abstract-movement-component";

export class BulletWeaponComponent extends AbstractWeaponComponent {

    public fire(): void {
        if (!this._reloaded) return;
        super.fire();
        const bullet: Bullet = new Bullet();
        bullet.setSkin({assetName: Assets.Bullets.BULLET});
        if (this._entity.getComponent(AbstractTeamComponent)) {
            bullet.setComponent(new BasicTeamComponent().setTeam(
                this._entity.getComponent(AbstractTeamComponent).getTeam()
            ));
        }
        if (this._entity.getComponent(AbstractMovementComponent)) {
            const vec = this._entity.getComponent(AbstractMovementComponent).rotationVector;
            bullet.x = (this._entity.x + vec.x) / 2;
            bullet.y = (this._entity.y + vec.y) / 2;
        } else {
            bullet.x = this._entity.x;
            bullet.y = this._entity.y;
        }
        SceneManager.currentScene.addChild(bullet);
        bullet.launch(this._entity.angle);
    }

    public clone(): BulletWeaponComponent { return new BulletWeaponComponent(this) }

}
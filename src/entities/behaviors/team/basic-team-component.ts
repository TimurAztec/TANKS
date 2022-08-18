import {AbstractTeamComponent} from "./abstract-team-component";

export class BasicTeamComponent extends AbstractTeamComponent {

    public clone(): BasicTeamComponent { return new BasicTeamComponent(this) }

}
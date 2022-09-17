import {AbstractTeamComponent} from "./abstract-team-component";

export class BasicTeamComponent extends AbstractTeamComponent {

    constructor(source?: BasicTeamComponent) {
        super(source);
        if (source?._team) this._team = source._team;
    }

}
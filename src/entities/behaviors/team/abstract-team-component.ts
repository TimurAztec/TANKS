import {ITeamComponent} from "./ITeamComponent";
import {AbstractComponent} from "../AbstractComponent";

export abstract class AbstractTeamComponent extends AbstractComponent implements ITeamComponent {

    protected _team: string = '';
    protected _setTeamCallback: Function = () => {};

    public getTeam(): string {
        return this._team;
    }

    public setTeam(team: string): AbstractComponent {
        this._team = team;
        this._setTeamCallback();
        return this;
    }

    public onTeamSet(callback: Function): void {
        this._setTeamCallback = callback;
    }
}
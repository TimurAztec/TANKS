import { IIndexable, randNum } from "../../../../../utils/utils";
import {AbstractControlComponent} from "./abstract-control-component";

class RandomControlComponent extends AbstractControlComponent {

    protected _actionChangeTimer: number = 0;
    protected _actionChangeDelay: number = 50;
    protected _nextAction: string = '';

    constructor(source?: RandomControlComponent) {
        super(source);
        this._actionChangeDelay = randNum(100, 10)
    }

    update(dt: number) {
        super.update(dt);
        this._actionChangeTimer += dt;
        if (this._actionChangeTimer > this._actionChangeDelay) {
            this._actionChangeTimer = 0;
            const chance = Math.floor(randNum(6));
            switch (chance) {
                case 1:
                    this._nextAction = 'Space';
                    break;
                case 2:
                    this._nextAction = 'Right';
                    break;
                case 3:
                    this._nextAction = 'Left';
                    break;
                case 4:
                    this._nextAction = 'Down';
                    break;
                case 5:
                    this._nextAction = 'Up';
                    break;
                default:
                    this._nextAction = '';
                    break;
            }
        }
        if (this._nextAction) {
            (this as IIndexable)[`triggerAction${this._nextAction}`]()
        }
    }

    public clone(): RandomControlComponent { return new RandomControlComponent(this) }
}

export { RandomControlComponent }
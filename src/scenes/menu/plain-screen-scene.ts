import {Scene} from "../scene";

export abstract class PainScreenScene extends Scene {

    constructor() {
        super();

        this.initVisuals();
        this.initActions();
    }

    protected abstract initVisuals(): void;

    protected abstract initActions(): void;

}
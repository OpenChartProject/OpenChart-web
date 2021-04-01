import { RootStore } from "../../store";
import { Action } from "../action";

export class PlayPauseAction implements Action {
    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;
    }

    run(): void {
        const { noteField } = this.store;
        noteField.setPlaying(!noteField.state.isPlaying);
    }
}

import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Action for toggling if the notefield is playing or not.
 */
export class PlayPauseAction implements Action {
    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;
    }

    run(): void {
        const { notefield } = this.store;
        notefield.setPlaying(!notefield.data.isPlaying);
    }

    undo(): void {
        this.run();
    }
}

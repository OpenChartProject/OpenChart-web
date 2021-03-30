import { Store } from "../../store";
import { Action } from "../action";

export class PlayPauseAction implements Action {
    store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    run(): void {
        this.store.setPlaying(!this.store.state.isPlaying);
    }
}

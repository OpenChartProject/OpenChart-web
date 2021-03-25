import { Store } from "../store";
import { Action } from "./action";

/**
 * Arguments for the SnapScrollAction.
 */
export interface SnapScrollArgs {
    direction: "forward" | "backward";
}

/**
 * Action for scrolling the notefield based on the current beat snapping.
 */
export class SnapScrollAction implements Action {
    args: SnapScrollArgs;
    store: Store;

    constructor(store: Store, args: SnapScrollArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { scroll, snap } = this.store.state;
        const beat =
            this.args.direction === "forward"
                ? snap.nextBeat(scroll.beat)
                : snap.prevBeat(scroll.beat);

        this.store.setScroll({ beat });
    }
}

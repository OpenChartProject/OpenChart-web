import { Store } from "../store";
import { Action } from "./action";

/**
 * Arguments for the SnapScrollAction.
 */
export interface SnapScrollArgs {
    direction: "forward" | "backward";
    autoInvert: boolean;
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
        let dir = this.args.direction;

        if (this.args.autoInvert && this.store.config.scrollDirection === "down") {
            dir = dir === "forward" ? "backward" : "forward";
        }

        const beat =
            dir === "forward"
                ? snap.nextBeat(scroll.beat)
                : snap.prevBeat(scroll.beat);

        this.store.setScroll({ beat });
    }
}

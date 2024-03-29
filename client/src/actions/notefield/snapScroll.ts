import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the SnapScrollAction.
 */
export interface SnapScrollArgs {
    direction: "forward" | "backward";
    autoInvert?: boolean;
}

/**
 * Action for scrolling the notefield based on the current beat snapping.
 */
export class SnapScrollAction implements Action {
    args: SnapScrollArgs;
    store: RootStore;

    constructor(store: RootStore, args: SnapScrollArgs) {
        this.args = args;
        this.store = store;

        if (this.args.autoInvert === undefined) {
            this.args.autoInvert = true;
        }
    }

    run(): void {
        const { scrollDirection } = this.store.notefieldDisplay.data;
        const { notefield } = this.store;

        // Ignore scroll events if the notefield is auto scrolling
        if (notefield.data.isPlaying) {
            return;
        }

        const { scroll, snap } = notefield.data;
        let dir = this.args.direction;

        if (this.args.autoInvert === true && scrollDirection === "down") {
            dir = dir === "forward" ? "backward" : "forward";
        }

        const beat = dir === "forward" ? snap.nextBeat(scroll.beat) : snap.prevBeat(scroll.beat);

        this.store.notefield.setScroll({ beat });
    }
}

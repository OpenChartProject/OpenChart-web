import assert from "assert";

import { Beat, BeatTime } from "../../charting";
import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the ScrollAction.
 */
export interface ScrollArgs {
    by?: { beat?: number; time?: number };
    to?: Partial<BeatTime>;
}

/**
 * Action for scrolling the notefield by beat/time.
 */
export class ScrollAction implements Action {
    args: ScrollArgs;
    oldScroll!: Beat;

    store: RootStore;

    constructor(store: RootStore, args: ScrollArgs) {
        assert(args.to || args.by, "both scroll arguments are undefined");

        this.args = args;
        this.store = store;
    }

    run(): void {
        const args = this.args;
        this.oldScroll = this.store.notefield.data.scroll.beat;

        if (args.by) {
            this.store.notefield.scrollBy(args.by);
        } else if (args.to) {
            this.store.notefield.setScroll(args.to);
        }
    }

    undo(): void {
        this.store.notefield.setScroll({ beat: this.oldScroll });
    }
}

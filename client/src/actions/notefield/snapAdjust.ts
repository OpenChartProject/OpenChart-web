import assert from "assert";
import Fraction from "fraction.js";
import { BeatSnap } from "../../notefield/beatsnap";

import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the SnapAdjustAction.
 */
export interface SnapAdjustArgs {
    adjust?: "next" | "prev";
    to?: Fraction;
}

/**
 * Action for adjusting the beat snapping.
 */
export class SnapAdjustAction implements Action {
    args: SnapAdjustArgs;
    oldSnap!: BeatSnap;

    store: RootStore;

    constructor(store: RootStore, args: SnapAdjustArgs) {
        assert(args.adjust || args.to, "both adjustment arguments are undefined");

        this.args = args;
        this.store = store;
    }

    run(): void {
        const args = this.args;
        const { snap } = this.store.notefield.data;

        this.oldSnap = snap;

        if (args.adjust === "next") {
            snap.nextSnap();
        } else if (args.adjust === "prev") {
            snap.prevSnap();
        } else if (args.to) {
            snap.setSnap(args.to);
        }
    }

    undo(): void {
        this.store.notefield.data.snap.setSnap(this.oldSnap.current);
    }
}

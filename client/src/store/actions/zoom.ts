import assert from "assert";
import Fraction from "fraction.js";
import { Store } from "../store";
import { Action } from "./action";

/**
 * Arguments for the ZoomAction.
 */
export interface ZoomArgs {
    to: Fraction;
}

/**
 * Action for setting the notefield zoom.
 */
export class ZoomAction implements Action {
    args: ZoomArgs;
    store: Store;

    constructor(store: Store, args: ZoomArgs) {
        assert(args.to.compare(0) === 1, "zoom must be greater than zero");

        this.args = args;
        this.store = store;
    }

    run(): void {
        this.store.setZoom(this.args.to);
    }
}

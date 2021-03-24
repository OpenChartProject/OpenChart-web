import assert from "assert";
import Fraction from "fraction.js";
import { RootStore } from "../store";
import { Action } from "./action";

/**
 * Arguments for the ScaleAction.
 */
export interface ScaleArgs {
    to: Fraction;
}

/**
 * Action for setting the scale of the notefield.
 */
export class ScaleAction implements Action {
    args: ScaleArgs;
    store: RootStore;

    constructor(store: RootStore, args: ScaleArgs) {
        assert(args.to.compare(0) === 1, "scale must be greater than zero");

        this.args = args;
        this.store = store;
    }

    run(): void {
        this.store.setScale(this.args.to);
    }
}

import assert from "assert";

import { KeyIndex } from "../../charting/keyIndex";
import { Beat } from "../../charting/beat";
import { Store } from "../store";
import { Action } from "./action";
import { Tap } from "../../charting/objects/tap";

/**
 * Arguments for the PlaceTapAction.
 */
export interface PlaceTapArgs {
    beat: Beat;
    key: KeyIndex;
}

/**
 * Action for placing a tap note.
 */
export class PlaceTapAction implements Action {
    args: PlaceTapArgs;
    store: Store;

    constructor(store: Store, args: PlaceTapArgs) {
        assert(
            args.key.value < store.config.chart.keyCount.value,
            "key index is out of range",
        );

        this.args = args;
        this.store = store;
    }

    run(): void {
        const { chart } = this.store.config;
        const args = this.args;

        chart.placeObject(new Tap(args.beat, args.key), {
            removeIfExists: true,
        });
    }
}

import assert from "assert";
import { Beat, BeatTime } from "../charting/beat";
import { KeyIndex } from "../charting/keyIndex";
import { Tap } from "../charting/objects/tap";
import { RootStore } from "./store";

/**
 * The different types of actions.
 */
export type ActionType = "placeTap" | "scroll";

/**
 * The base interface for an action. Every action includes a type which says what
 * kind of action it is, as well as any arguments.
 *
 * Actions are useful for several reasons:
 *  - Separation of concerns
 *  - Modifies the store "correctly" (which triggers a notefield redraw)
 *  - Encapsulating actions as objects makes undo/redo easier to implement
 */
export interface Action {
    type: ActionType;
    args: any;
}

/**
 * Arguments for the PlaceTapAction.
 */
export interface PlaceTapActionArgs {
    beat: Beat;
    key: KeyIndex;
}

/**
 * An action for placing tap notes onto the notefield.
 */
export interface PlaceTapAction extends Action {
    type: "placeTap";
    args: PlaceTapActionArgs;
}

/**
 * Arguments for the ScrollAction.
 */
export interface ScrollActionArgs {
    by?: { beat?: number; time?: number };
    to?: Partial<BeatTime>;
}

/**
 * An action for placing tap notes onto the notefield.
 */
export interface ScrollAction extends Action {
    type: "scroll";
    args: ScrollActionArgs;
}

/**
 * Returns a PlaceTapAction that uses the provided arguments.
 */
export function createPlaceTapAction(args: PlaceTapActionArgs): PlaceTapAction {
    return {
        type: "placeTap",
        args,
    };
}

/**
 * Returns a ScrollAction that uses the provided arguments.
 */
export function createScrollAction(args: ScrollActionArgs): ScrollAction {
    return {
        type: "scroll",
        args,
    };
}

/**
 * Executes an action against the store.
 */
export function doAction(action: Action, store: RootStore) {
    const chart = store.config.chart;

    if (action.type === "placeTap") {
        const args = (action as PlaceTapAction).args;
        assert(
            args.key.value < chart.keyCount.value,
            "key index is out of range",
        );

        chart.placeObject(new Tap(args.beat, args.key), {
            removeIfExists: true,
        });
    } else if (action.type === "scroll") {
        const args = (action as ScrollAction).args;

        if (args.by !== undefined) {
            store.scrollBy(args.by);
        } else if (args.to !== undefined) {
            store.setScroll(args.to);
        } else {
            assert(args.to || args.by, "both scroll arguments are undefined");
        }
    }
}

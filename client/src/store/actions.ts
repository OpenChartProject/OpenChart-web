import assert from "assert";
import { Beat, BeatTime } from "../charting/beat";
import { KeyIndex } from "../charting/keyIndex";
import { Tap } from "../charting/objects/tap";
import { RootStore } from "./store";

/**
 * The different types of actions.
 */
export type ActionType = "placeTap" | "scroll" | "snapScroll";

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
export interface PlaceTapArgs {
    beat: Beat;
    key: KeyIndex;
}

/**
 * An action for placing tap notes onto the notefield.
 */
export interface PlaceTapAction extends Action {
    type: "placeTap";
    args: PlaceTapArgs;
}

/**
 * Arguments for the ScrollAction.
 */
export interface ScrollArgs {
    by?: { beat?: number; time?: number };
    to?: Partial<BeatTime>;
}

/**
 * An action for scrolling the notefield based on beats or time.
 */
export interface ScrollAction extends Action {
    type: "scroll";
    args: ScrollArgs;
}

/**
 * Arguments for the SnapScrollAction.
 */
export interface SnapScrollArgs {
    direction: "forward" | "backward";
}

/**
 * An action for scrolling the notefield based on the current beat snap setting.
 */
export interface SnapScrollAction extends Action {
    type: "snapScroll";
    args: SnapScrollArgs;
}

/**
 * Returns a PlaceTapAction that uses the provided arguments.
 */
export function createPlaceTapAction(args: PlaceTapArgs): PlaceTapAction {
    return {
        type: "placeTap",
        args,
    };
}

/**
 * Returns a ScrollAction that uses the provided arguments.
 */
export function createScrollAction(args: ScrollArgs): ScrollAction {
    return {
        type: "scroll",
        args,
    };
}

/**
 * Returns a SnapScrollAction that uses the provided arguments.
 */
export function createSnapScrollAction(args: SnapScrollArgs): SnapScrollAction {
    return {
        type: "snapScroll",
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
    } else if (action.type === "snapScroll") {
        const args = (action as SnapScrollAction).args;
        const beat =
            args.direction === "forward"
                ? store.state.snap.nextBeat(store.state.scroll.beat)
                : store.state.snap.prevBeat(store.state.scroll.beat);

        store.setScroll({ beat });
    }
}

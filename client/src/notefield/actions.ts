import assert from "assert";
import { Beat, BeatTime } from "../charting/beat";
import { KeyIndex } from "../charting/keyIndex";
import { Tap } from "../charting/objects/tap";
import { RootStore } from "../store";

export type ActionType = "placeTap" | "scroll";

export interface Action {
    type: ActionType;
    args: any;
}

export interface PlaceTapActionArgs {
    beat: Beat;
    key: KeyIndex;
}

export interface PlaceTapAction extends Action {
    type: "placeTap";
    args: PlaceTapActionArgs;
}

export interface ScrollActionArgs {
    by?: { beat?: number; time?: number };
    to?: Partial<BeatTime>;
}

export interface ScrollAction extends Action {
    type: "scroll";
    args: ScrollActionArgs;
}

export function createPlaceTapAction(args: PlaceTapActionArgs): PlaceTapAction {
    return {
        type: "placeTap",
        args,
    };
}

export function createScrollAction(args: ScrollActionArgs): ScrollAction {
    return {
        type: "scroll",
        args,
    };
}

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

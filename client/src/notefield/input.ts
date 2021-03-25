import { KeyIndex } from "../charting/keyIndex";
import { Store } from "../store/store";
import {
    Action,
    PlaceTapAction,
    SnapScrollAction,
    SnapAdjustAction,
} from "../store/actions/";

/**
 * The keybind configuration.
 */
export interface KeyBinds {
    keys: {
        [key: number]: string[];
    };

    scroll: {
        up: string;
        down: string;
        snapNext: string;
        snapPrev: string;
    };
}

/**
 * Converts a KeyboardEvent to an action, using the keybind config provided by
 * the store. Returns null if the key isn't bound to anything.
 */
export function inputToAction(e: KeyboardEvent, store: Store): Action | null {
    const { chart, keyBinds } = store.config;

    // Check if this key is for placing a note.
    const keyIndex = keyBinds.keys[chart.keyCount.value].findIndex(
        (k) => k === e.key,
    );

    if (keyIndex !== -1) {
        return new PlaceTapAction(store, {
            beat: store.state.scroll.beat,
            key: new KeyIndex(keyIndex),
        });
    }

    switch (e.key) {
        case keyBinds.scroll.up:
            e.preventDefault();
            return new SnapScrollAction(store, {
                direction: "backward",
            });

        case keyBinds.scroll.down:
            e.preventDefault();
            return new SnapScrollAction(store, {
                direction: "forward",
            });

        case keyBinds.scroll.snapNext:
            e.preventDefault();
            return new SnapAdjustAction(store, {
                adjust: "next",
            });
            break;

        case keyBinds.scroll.snapPrev:
            e.preventDefault();
            return new SnapAdjustAction(store, {
                adjust: "prev",
            });
            break;
    }

    return null;
}

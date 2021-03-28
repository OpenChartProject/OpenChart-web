import { KeyIndex } from "../charting/";
import { Store } from "../store/store";
import {
    Action,
    PlaceTapAction,
    SnapScrollAction,
    SnapAdjustAction,
    ZoomAction,
} from "../actions/storeActions/";

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
 * The different event types that can be handled by inputToAction.
 */
export type InputActionType = "wheel" | "keydown";

/**
 * The args for inputToAction.
 */
export interface InputActionArgs {
    type: InputActionType;
    event: Event;
}

/**
 * Takes a raw DOM input event and converts it to an Action. If the input doesn't map
 * to anything, returns null.
 */
export function inputToAction(e: InputActionArgs, store: Store): Action | null {
    switch (e.type) {
        case "keydown":
            return keyboardInputToAction(e.event as KeyboardEvent, store);
        case "wheel":
            return wheelInputToAction(e.event as WheelEvent, store);
    }
}

/**
 * Maps a keyboard event to an Action.
 */
export function keyboardInputToAction(e: KeyboardEvent, store: Store): Action | null {
    const { chart, keyBinds } = store.config;

    // Check if this key is for placing a note.
    const keyIndex = keyBinds.keys[chart.keyCount.value].findIndex((k) => k === e.key);

    if (keyIndex !== -1) {
        return new PlaceTapAction(store, {
            beat: store.state.scroll.beat,
            key: new KeyIndex(keyIndex),
        });
    }

    switch (e.key) {
        case keyBinds.scroll.up:
            e.preventDefault();

            if (e.ctrlKey) {
                return new ZoomAction(store, {
                    to: store.state.zoom.mul(1.5),
                });
            } else {
                return new SnapScrollAction(store, {
                    direction: "backward",
                });
            }

        case keyBinds.scroll.down:
            e.preventDefault();

            if (e.ctrlKey) {
                return new ZoomAction(store, {
                    to: store.state.zoom.div(1.5),
                });
            } else {
                return new SnapScrollAction(store, {
                    direction: "forward",
                });
            }

        case keyBinds.scroll.snapNext:
            e.preventDefault();
            return new SnapAdjustAction(store, {
                adjust: "next",
            });

        case keyBinds.scroll.snapPrev:
            e.preventDefault();
            return new SnapAdjustAction(store, {
                adjust: "prev",
            });
    }

    return null;
}

/**
 * Maps a mouse wheel event to an Action.
 */
export function wheelInputToAction(e: WheelEvent, store: Store): Action | null {
    if (e.deltaY === 0) {
        return null;
    }

    e.preventDefault();

    if (e.deltaY > 0) {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: store.state.zoom.div(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "forward",
            });
        }
    } else {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: store.state.zoom.mul(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "backward",
            });
        }
    }
}

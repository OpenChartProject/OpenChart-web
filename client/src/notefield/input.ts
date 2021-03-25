import { KeyIndex } from "../charting/keyIndex";
import { Store } from "../store/store";
import {
    Action,
    PlaceTapAction,
    SnapScrollAction,
    SnapAdjustAction,
    ScaleAction,
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

export type InputActionType = "wheel" | "keydown";

export interface InputActionEvent {
    type: InputActionType;
    event: Event;
}

/**
 * Converts a KeyboardEvent to an action, using the keybind config provided by
 * the store. Returns null if the key isn't bound to anything.
 */
export function inputToAction(
    e: InputActionEvent,
    store: Store,
): Action | null {
    switch (e.type) {
        case "keydown":
            return keyboardInputToAction(e.event as KeyboardEvent, store);
        case "wheel":
            return wheelInputToAction(e.event as WheelEvent, store);
    }
}

export function keyboardInputToAction(
    e: KeyboardEvent,
    store: Store,
): Action | null {
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

            if (e.ctrlKey) {
                return new ScaleAction(store, {
                    to: store.state.scaleY.div(1.5),
                });
            } else {
                return new SnapScrollAction(store, {
                    direction: "backward",
                });
            }

        case keyBinds.scroll.down:
            e.preventDefault();

            if (e.ctrlKey) {
                return new ScaleAction(store, {
                    to: store.state.scaleY.mul(1.5),
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

export function wheelInputToAction(e: WheelEvent, store: Store): Action | null {
    if (e.deltaY === 0) {
        return null;
    }

    e.preventDefault();

    if (e.deltaY > 0) {
        if (e.ctrlKey) {
            return new ScaleAction(store, {
                to: store.state.scaleY.mul(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "forward",
            });
        }
    } else {
        if (e.ctrlKey) {
            return new ScaleAction(store, {
                to: store.state.scaleY.div(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "backward",
            });
        }
    }
}

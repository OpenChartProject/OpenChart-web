import {
    Action,
    PlaceTapAction,
    PlayPauseAction,
    SnapAdjustAction,
    SnapScrollAction,
    ZoomAction,
} from "../actions/noteFieldActions/";
import { KeyIndex } from "../charting/";
import { RootStore } from "../store/";

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

    playPause: string;
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
export function inputToAction(e: InputActionArgs, store: RootStore): Action | null {
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
export function keyboardInputToAction(e: KeyboardEvent, store: RootStore): Action | null {
    const { chart } = store.noteField;
    const { keyBinds } = store.ui.data;
    const { scroll, zoom } = store.noteField.data;

    // Check if this key is for placing a note.
    const keyIndex = keyBinds.keys[chart.keyCount.value].findIndex((k) => k === e.key);

    if (keyIndex !== -1) {
        return new PlaceTapAction(store, {
            beat: scroll.beat,
            key: new KeyIndex(keyIndex),
        });
    }

    switch (e.key) {
        case keyBinds.scroll.up:
            e.preventDefault();

            if (e.ctrlKey) {
                return new ZoomAction(store, {
                    to: zoom.mul(1.5),
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
                    to: zoom.div(1.5),
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

        case keyBinds.playPause:
            e.preventDefault();
            return new PlayPauseAction(store);
    }

    return null;
}

/**
 * Maps a mouse wheel event to an Action.
 */
export function wheelInputToAction(e: WheelEvent, store: RootStore): Action | null {
    if (e.deltaY === 0) {
        return null;
    }

    const { zoom } = store.noteField.data;
    e.preventDefault();

    if (e.deltaY > 0) {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: zoom.div(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "forward",
            });
        }
    } else {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: zoom.mul(1.5),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "backward",
            });
        }
    }
}

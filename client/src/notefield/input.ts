import {
    Action,
    PlaceTapAction,
    PlayPauseAction,
    SnapAdjustAction,
    SnapScrollAction,
    ZoomAction,
} from "../actions/notefield";
import { MouseDownAction } from "../actions/notefield/mouseDown";
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
export type InputActionType = "keydown" | "mousedown" | "mouseup" | "wheel";

/**
 * The args for inputToAction.
 */
export interface InputActionArgs {
    /* The DOM event that was triggered. */
    event: Event;

    /* Is true if the event target was specifically the canvas where we draw the notefield. */
    inCanvas?: boolean;

    /*
    The type of event that was triggered. This is the same as `event.type`, but we can
    explicitly say which events we can handle, adding a bit of type safety.
    */
    type: InputActionType;
}

/**
 * Takes a raw DOM input event and converts it to an Action. If the input doesn't map
 * to anything, returns null.
 */
export function inputToAction(e: InputActionArgs, store: RootStore): Action | null {
    const inCanvas = !!e.inCanvas;

    switch (e.type) {
        case "keydown":
            return keyboardInputToAction(e.event as KeyboardEvent, store);
        case "mousedown":
            return mouseDownInputToAction(e.event as MouseEvent, inCanvas, store);
        case "mouseup":
            return mouseUpInputToAction(e.event as MouseEvent, inCanvas, store);
        case "wheel":
            return wheelInputToAction(e.event as WheelEvent, inCanvas, store);
    }
}

/**
 * Maps a keyboard event to an Action.
 */
export function keyboardInputToAction(e: KeyboardEvent, store: RootStore): Action | null {
    const { chart } = store.notefield.data;
    const { keyBinds } = store.ui.data;
    const { scroll, zoom } = store.notefield.data;

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
                    to: zoom.mul(ZoomAction.SCALAR),
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
                    to: zoom.div(ZoomAction.SCALAR),
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
 * Maps a mouse button press event to an Action.
 */
export function mouseDownInputToAction(
    e: MouseEvent,
    inCanvas: boolean,
    store: RootStore,
): Action | null {
    return new MouseDownAction(store, { event: e, inCanvas });
}

/**
 * Maps a mouse button release event to an Action.
 */
export function mouseUpInputToAction(
    e: MouseEvent,
    inCanvas: boolean,
    store: RootStore,
): Action | null {
    return null;
}

/**
 * Maps a mouse wheel event to an Action.
 */
export function wheelInputToAction(
    e: WheelEvent,
    inCanvas: boolean,
    store: RootStore,
): Action | null {
    if (e.deltaY === 0) {
        return null;
    }

    const { zoom } = store.notefield.data;
    e.preventDefault();

    if (e.deltaY > 0) {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: zoom.div(ZoomAction.SCALAR),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "forward",
            });
        }
    } else {
        if (e.ctrlKey) {
            return new ZoomAction(store, {
                to: zoom.mul(ZoomAction.SCALAR),
            });
        } else {
            return new SnapScrollAction(store, {
                direction: "backward",
            });
        }
    }
}

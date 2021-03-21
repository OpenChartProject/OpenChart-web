import { KeyIndex } from "../charting/keyIndex";
import { RootStore } from "../store";
import { Action, createPlaceTapAction, createScrollAction } from "./actions";


export interface KeyBinds {
    keys: {
        [key: number]: string[];
    };

    scroll: {
        up: string;
        down: string;
    };
}


export function inputToAction(e: KeyboardEvent, store: RootStore): Action | null {
    const { chart, keyBinds, secondsPerScrollTick } = store.config;

    // Check if this key is for placing a note.
    const keyIndex = keyBinds.keys[chart.keyCount.value].findIndex(k => k === e.key);

    if (keyIndex !== -1) {
        return createPlaceTapAction({ beat: store.state.scroll.beat, key: new KeyIndex(keyIndex) });
    }

    switch (e.key) {
        case keyBinds.scroll.up:
            e.preventDefault();
            return createScrollAction({ by: { time: -1 * secondsPerScrollTick } });
        case keyBinds.scroll.down:
            e.preventDefault();
            return createScrollAction({ by: { time: 1 * secondsPerScrollTick } });
    }

    return null;
}

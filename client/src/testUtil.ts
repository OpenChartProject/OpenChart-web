import _ from "lodash";

import { Chart } from "./charting";
import { NoteSkin } from "./noteskin";
import { EditorConfig, NoteFieldState, RootStore } from "./store";

/**
 * Returns a dummy noteskin for testing. The noteskin doesn't refer to any actual
 * images, but it does include a width and height for each asset.
 */
export function createDummyNoteSkin(keyCount = 4): NoteSkin {
    const dim = { width: 128, height: 128 };
    const ns: NoteSkin = {
        name: "dummy-skin",
        keyCount,
        hold: [],
        holdBody: [],
        receptor: [],
        tap: [],
    };

    for (let i = 0; i < keyCount; i++) {
        ns.hold.push(dim as any);
        ns.holdBody.push(dim as any);
        ns.receptor.push(dim as any);
        ns.tap.push(dim as any);
    }

    return ns;
}

export interface CreateStoreArgs {
    chart?: Chart;
    config?: Partial<EditorConfig>;
    state?: Partial<NoteFieldState>;
}

/**
 * Returns a new store with reasonable defaults, useful for testing.
 */
export function createStore(args: CreateStoreArgs = {}): RootStore {
    const store = new RootStore();
    store.noteField.setCanvas(document.createElement("canvas"));
    store.noteField.music.el = document.createElement("audio");

    if (args.chart) {
        store.noteField.setChart(args.chart);
    }

    if (args.config) {
        store.editor.update(args.config);
    }

    if (args.state) {
        store.noteField.state = _.merge(store.noteField.state, args.state);
    }

    return store;
}

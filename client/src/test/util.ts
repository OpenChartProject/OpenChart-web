import _ from "lodash";
import sinon from "sinon";

import { NoteSkin } from "../noteskin";
import { RootStore } from "../store";

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

/**
 * Returns a new store with reasonable defaults, useful for testing.
 */
export function createStore(): RootStore {
    const store = new RootStore();

    store.notefield.setCanvas(document.createElement("canvas"));
    sinon.stub(store.notefield.metronome);

    return store;
}

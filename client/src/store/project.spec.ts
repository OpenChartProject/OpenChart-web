import assert from "assert";

import { createStore } from "../test";

describe("ProjectStore", () => {
    describe("#setAudioOffset", () => {
        it("updates the offset", () => {
            const store = createStore().project;
            const offset = -0.5;

            store.setAudioOffset(offset);

            assert.strictEqual(store.data.song.audioOffset, offset);
        });
    });
});

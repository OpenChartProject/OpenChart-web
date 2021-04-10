import assert from "assert";

import { createStore } from "../../testUtil";

import { PlayPauseAction } from "./playPause";

describe("PlayPauseAction", () => {
    describe("#run", () => {
        it("toggles if the notefield is playing", () => {
            const store = createStore();

            new PlayPauseAction(store).run();
            assert.strictEqual(store.notefield.data.isPlaying, true);

            new PlayPauseAction(store).run();
            assert.strictEqual(store.notefield.data.isPlaying, false);
        });
    });
});

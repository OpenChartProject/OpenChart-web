import assert from "assert";

import { createStore } from "../../testUtil";

import { ScrollDirectionAction } from "./scrollDirection";

describe("ScrollDirectionAction", () => {
    describe("#run", () => {
        it("sets the scroll direction to the provided value", () => {
            const store = createStore();
            store.editor.data.scrollDirection = "down";

            new ScrollDirectionAction(store, { to: "up" }).run();
            assert.strictEqual(store.editor.data.scrollDirection, "up");

            new ScrollDirectionAction(store, { to: "down" }).run();
            assert.strictEqual(store.editor.data.scrollDirection, "down");
        });

        it("swaps the scroll direction", () => {
            const store = createStore();
            store.editor.data.scrollDirection = "down";

            new ScrollDirectionAction(store, { to: "swap" }).run();
            assert.strictEqual(store.editor.data.scrollDirection, "up");

            new ScrollDirectionAction(store, { to: "swap" }).run();
            assert.strictEqual(store.editor.data.scrollDirection, "down");
        });
    });
});

import assert from "assert";

import { createStore } from "../../test";

import { ScrollDirectionAction } from "./scrollDirection";

describe("ScrollDirectionAction", () => {
    describe("#run", () => {
        it("sets the scroll direction to the provided value", () => {
            const store = createStore();
            store.notefieldDisplay.data.scrollDirection = "down";

            new ScrollDirectionAction(store, { to: "up" }).run();
            assert.strictEqual(store.notefieldDisplay.data.scrollDirection, "up");

            new ScrollDirectionAction(store, { to: "down" }).run();
            assert.strictEqual(store.notefieldDisplay.data.scrollDirection, "down");
        });

        it("swaps the scroll direction", () => {
            const store = createStore();
            store.notefieldDisplay.data.scrollDirection = "down";

            new ScrollDirectionAction(store, { to: "swap" }).run();
            assert.strictEqual(store.notefieldDisplay.data.scrollDirection, "up");

            new ScrollDirectionAction(store, { to: "swap" }).run();
            assert.strictEqual(store.notefieldDisplay.data.scrollDirection, "down");
        });
    });
});

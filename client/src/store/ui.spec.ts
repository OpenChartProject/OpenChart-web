import assert from "assert";
import sinon from "sinon";

import { createStore } from "../testUtil";

describe("UIStore", () => {
    describe("#setMusic", () => {
        it("sets the music source", () => {
            const store = createStore().ui;

            store.setMusic("foo");
            assert.strictEqual(store.data.music.src, "foo");
        });

        it("pauses the music", () => {
            const store = createStore().ui;
            const spy = sinon.spy(store.controllers.music, "pause");

            store.setMusic("foo");
            assert(spy.called);
        });
    });
});

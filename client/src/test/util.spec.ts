import assert from "assert";
import _ from "lodash";

import { Chart } from "../charting";

import { createDummyNoteSkin, createStore } from "./util";

describe("test", () => {
    describe("#createDummyNoteSkin", () => {
        it("returns a dummy skin with a default keycount of 4", () => {
            const ns = createDummyNoteSkin();
            assert.strictEqual(ns.keyCount, 4);
        });

        it("returns a dummy skin with the provided keycount", () => {
            const ns = createDummyNoteSkin(7);
            assert.strictEqual(ns.keyCount, 7);
        });

        it("returns a dummy skin with the expected number of assets", () => {
            const ns = createDummyNoteSkin();
            assert.strictEqual(ns.hold.length, ns.keyCount);
            assert.strictEqual(ns.holdBody.length, ns.keyCount);
            assert.strictEqual(ns.receptor.length, ns.keyCount);
            assert.strictEqual(ns.tap.length, ns.keyCount);
        });
    });

    describe("#createStore", () => {
        it("creates a store with defaults", () => {
            const store = createStore();
            assert.deepStrictEqual(store.notefield.data.chart, new Chart());
            assert(store.notefield.canvas);
        });
    });
});

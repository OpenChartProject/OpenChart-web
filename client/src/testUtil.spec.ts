import assert from "assert";
import Fraction from "fraction.js";

import { Chart } from "./charting";
import { KeyCount } from "./charting";
import { EditorData, NoteFieldData } from "./store";
import { createDummyNoteSkin, createStore } from "./testUtil";

describe("testutil", () => {
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
            assert(store.editor);
            assert(store.noteField);
            assert.deepStrictEqual(store.noteField.chart, new Chart());
        });

        it("creates a store with the provided chart", () => {
            const chart = new Chart({ keyCount: new KeyCount(7) });
            const store = createStore({ chart });
            assert.strictEqual(store.noteField.chart, chart);
        });

        it("merges the config if provided", () => {
            const defaultStore = createStore();
            const config: Partial<EditorData> = {
                colors: {
                    background: "red",
                },
                pixelsPerSecond: 1,
            };
            const store = createStore({ config });

            // Sanity check to make sure that the merge didn't remove anything
            assert.deepStrictEqual(defaultStore.editor.data.receptorY, store.editor.data.receptorY);
            assert.deepStrictEqual(defaultStore.editor.data.beatLines, store.editor.data.beatLines);

            assert.strictEqual(store.editor.data.pixelsPerSecond, config.pixelsPerSecond);
            assert.strictEqual(store.editor.data.colors.background, config.colors?.background);
        });

        it("merges the state if provided", () => {
            const state: Partial<NoteFieldData> = {
                zoom: new Fraction(1, 2),
            };
            const store = createStore({ state });

            assert.deepStrictEqual(store.noteField.data.zoom, state.zoom);
        });
    });
});

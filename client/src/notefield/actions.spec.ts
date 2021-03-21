import assert from "assert";
import { Beat } from "../charting/beat";
import { KeyIndex } from "../charting/keyIndex";
import { createPlaceTapAction, createScrollAction, doAction } from "./actions";
import { createStore } from "../test";
import { Tap } from "../charting/objects/tap";

describe("notefield/actions", () => {
    describe("#createPlaceTapAction", () => {
        it("returns expected action", () => {
            const args = {
                beat: Beat.Zero,
                key: new KeyIndex(1),
            };
            const action = createPlaceTapAction(args);
            assert.strictEqual(action.type, "placeTap");
            assert.deepStrictEqual(action.args, args);
        });
    });

    describe("#createScrollAction", () => {
        it("returns expected action", () => {
            const args = {
                by: { beat: -1 },
            };
            const action = createScrollAction(args);
            assert.strictEqual(action.type, "scroll");
            assert.deepStrictEqual(action.args, args);
        });
    });

    describe("#doAction", () => {
        describe("PlaceTapAction", () => {
            it("throws if key index is out of range", () => {
                const store = createStore();
                const action = createPlaceTapAction({
                    beat: Beat.Zero,
                    key: new KeyIndex(store.config.chart.keyCount.value),
                });
                assert.throws(() => doAction(action, store));
            });

            it("places a new tap object", () => {
                const store = createStore();
                const { chart } = store.config;
                const action = createPlaceTapAction({
                    beat: Beat.Zero,
                    key: new KeyIndex(0),
                });

                doAction(action, store);
                assert.strictEqual(chart.objects[0].length, 1);
                assert.strictEqual(chart.objects[0][0].type, "tap");
            });

            it("removes existing objects", () => {
                const store = createStore();
                const { chart } = store.config;
                const action = createPlaceTapAction({
                    beat: Beat.Zero,
                    key: new KeyIndex(0),
                });

                chart.placeObject(new Tap(0, 0));

                doAction(action, store);
                assert.strictEqual(chart.objects[0].length, 0);
            });
        });
    });
});

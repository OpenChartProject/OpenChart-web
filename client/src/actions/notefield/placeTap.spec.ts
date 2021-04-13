import assert from "assert";
import sinon from "sinon";

import { Beat } from "../../charting";
import { KeyIndex } from "../../charting";
import { Tap } from "../../charting/objects";
import { createStore } from "../../test";

import { PlaceTapAction, PlaceTapArgs } from "./placeTap";

describe("PlaceTapAction", () => {
    describe("new", () => {
        it("throws if key index is out of range", () => {
            const store = createStore();
            const { chart } = store.notefield.data;
            const args: PlaceTapArgs = {
                beat: Beat.Zero,
                key: new KeyIndex(chart.keyCount.value),
            };

            assert.throws(() => new PlaceTapAction(store, args));
        });
    });

    describe("#run", () => {
        it("calls placeObject", () => {
            const store = createStore();
            const { chart } = store.notefield.data;
            const args: PlaceTapArgs = {
                beat: Beat.Zero,
                key: new KeyIndex(0),
            };
            const placeObject = sinon.spy(chart, "placeObject");

            new PlaceTapAction(store, args).run();
            assert(
                placeObject.calledWith(new Tap(args.beat, args.key), {
                    removeIfExists: true,
                }),
            );
        });
    });
});

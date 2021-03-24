import assert from "assert";
import sinon from "sinon";

import { createStore } from "../../test";
import { Beat } from "../../charting/beat";
import { KeyIndex } from "../../charting/keyIndex";
import { PlaceTapAction, PlaceTapArgs } from "./placeTap";
import { Tap } from "../../charting/objects/tap";

describe("PlaceTapAction", () => {
    describe("new", () => {
        it("throws if key index is out of range", () => {
            const store = createStore();
            const args: PlaceTapArgs = {
                beat: Beat.Zero,
                key: new KeyIndex(store.config.chart.keyCount.value),
            };

            assert.throws(() => new PlaceTapAction(store, args));
        });
    });

    describe("#run", () => {
        it("calls placeObject", () => {
            const store = createStore();
            const { chart } = store.config;
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

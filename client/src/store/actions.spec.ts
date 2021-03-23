import assert from "assert";
import sinon from "sinon";
import { Beat } from "../charting/beat";
import { KeyIndex } from "../charting/keyIndex";
import {
    createPlaceTapAction,
    createScrollAction,
    createSnapScrollAction,
    doAction,
    PlaceTapArgs,
    ScrollArgs,
    SnapScrollArgs,
} from "./actions";
import { createStore } from "../test";
import { Tap } from "../charting/objects/tap";

describe("notefield/actions", () => {
    describe("#createPlaceTapAction", () => {
        it("returns expected action", () => {
            const args: PlaceTapArgs = {
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
            const args: ScrollArgs = {
                by: { beat: -1 },
            };
            const action = createScrollAction(args);
            assert.strictEqual(action.type, "scroll");
            assert.deepStrictEqual(action.args, args);
        });
    });

    describe("#createSnapScrollAction", () => {
        it("returns expected action", () => {
            const args: SnapScrollArgs = {
                direction: "forward",
            };
            const action = createSnapScrollAction(args);
            assert.strictEqual(action.type, "snapScroll");
            assert.deepStrictEqual(action.args, args);
        });
    });

    describe("#doAction", () => {
        afterEach(() => sinon.restore());

        describe("PlaceTapAction", () => {
            it("throws if key index is out of range", () => {
                const store = createStore();
                const action = createPlaceTapAction({
                    beat: Beat.Zero,
                    key: new KeyIndex(store.config.chart.keyCount.value),
                });
                assert.throws(() => doAction(action, store));
            });

            it("calls placeObject", () => {
                const store = createStore();
                const { chart } = store.config;
                const action = createPlaceTapAction({
                    beat: Beat.Zero,
                    key: new KeyIndex(0),
                });
                const placeObject = sinon.spy(chart, "placeObject");

                doAction(action, store);
                assert(
                    placeObject.calledWith(
                        new Tap(action.args.beat, action.args.key),
                        { removeIfExists: true },
                    ),
                );
            });
        });

        describe("ScrollAction", () => {
            it("throws if neither arg is set", () => {
                const store = createStore();
                const action = createScrollAction({});
                assert.throws(() => doAction(action, store));
            });

            it("calls scrollBy when 'by' arg is set", () => {
                const store = createStore();
                const action = createScrollAction({
                    by: { beat: 1 },
                });
                const scrollBy = sinon.spy(store, "scrollBy");

                doAction(action, store);
                assert(scrollBy.calledWith(action.args.by));
            });

            it("calls setScroll when 'to' arg is set", () => {
                const store = createStore();
                const action = createScrollAction({
                    to: { beat: Beat.Zero },
                });
                const setScroll = sinon.spy(store, "setScroll");

                doAction(action, store);
                assert(setScroll.calledWith(action.args.to));
            });
        });

        describe("SnapScrollAction", () => {
            it("calls setScroll with expected args when direction is forward", () => {
                const store = createStore();
                const action = createSnapScrollAction({
                    direction: "forward",
                });
                const setScroll = sinon.spy(store, "setScroll");

                doAction(action, store);
                assert(setScroll.calledWith({ beat: new Beat(1) }));
            });

            it("calls setScroll with expected args when direction is backward", () => {
                const store = createStore();
                store.setScroll({ beat: new Beat(1) });
                const action = createSnapScrollAction({
                    direction: "backward",
                });
                const setScroll = sinon.spy(store, "setScroll");

                doAction(action, store);
                assert(setScroll.calledWith({ beat: Beat.Zero }));
            });
        });
    });
});

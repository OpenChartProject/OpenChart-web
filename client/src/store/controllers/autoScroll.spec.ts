import assert from "assert";
import sinon from "sinon";

import { createStore } from "../../testUtil";

import { AutoScrollController } from "./autoScroll";

describe("AutoScrollController", () => {
    describe("new", () => {
        it("initializes as expected", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);

            assert(asc.metronome);

            // Tests that the onFrame method was bound.
            assert.strictEqual(asc.onFrame.prototype, undefined);
        });
    });

    describe("#onFrame", () => {
        it("calls scrollBy with a time of 0 on the first frame", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(store.notefield, "scrollBy");

            store.notefield.data.isPlaying = true;
            asc.onFrame(1000);

            assert(stub.calledWith({ time: 0 }));
        });

        it("calls scrollBy with the time difference from the last frame", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(store.notefield, "scrollBy");

            store.notefield.data.isPlaying = true;
            asc.earlier = 1000;

            asc.onFrame(2500);

            assert(stub.calledWith({ time: 1.5 }));
        });

        it("calls metronome update with the current scroll beat", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(asc.metronome, "update");

            store.notefield.data.isPlaying = true;
            asc.onFrame(1000);

            assert(stub.calledWith(store.notefield.data.scroll.beat));
        });

        it("calls requestAnimationFrame again if notefield is playing", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(globalThis, "requestAnimationFrame");

            store.notefield.data.isPlaying = true;
            asc.onFrame(1000);

            assert(stub.calledWith(asc.onFrame));
        });

        it("doesn't call requestAnimationFrame if notefield is paused", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(globalThis, "requestAnimationFrame");

            asc.onFrame(1000);

            assert(stub.notCalled);
        });
    });

    describe("#start", () => {
        it("calls requestAnimationFrame with onFrame as the callback", () => {
            const store = createStore();
            const asc = new AutoScrollController(store);
            const stub = sinon.stub(globalThis, "requestAnimationFrame");

            // Simulate having used the auto scroller before.
            asc.earlier = 1234;

            asc.start();

            assert.strictEqual(asc.earlier, -1);
            assert(stub.calledWith(asc.onFrame));
        });
    });
});

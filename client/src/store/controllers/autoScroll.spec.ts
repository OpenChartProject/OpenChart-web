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

    describe("#onFrame", () => { });

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

import assert from "assert";
import sinon from "sinon";

import { Beat } from "../../charting";
import { createStore } from "../../testUtil";

import { MetronomeController } from "./metronome";

describe("MetronomeController", () => {
    describe("#update", () => {
        beforeEach(() => {
            sinon.restore();
        });

        it("sets the lastBeat attribute", () => {
            const store = createStore().ui;
            const mc = new MetronomeController(store);
            const beat = new Beat(1);

            mc.update(beat);
            assert.strictEqual(mc.lastBeat, beat);
        });

        it("emits a tick event if it's a whole beat", () => {
            const store = createStore().ui;
            const mc = new MetronomeController(store);
            const beat = new Beat(1);
            const spy = sinon.spy(store.emitters.metronome, "emit");

            mc.update(beat);
            assert(spy.calledOnce);
        });

        it("emits a tick event if the beat crossed a whole beat", () => {
            const store = createStore().ui;
            const mc = new MetronomeController(store);
            const spy = sinon.spy(store.emitters.metronome, "emit");

            mc.update(new Beat(0.5));
            assert(spy.notCalled);

            mc.update(new Beat(1.5));
            assert(spy.calledOnce);
        });
    });
});

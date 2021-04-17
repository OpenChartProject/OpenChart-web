import assert from "assert";
import sinon from "sinon";

import { Beat } from "../../charting";
import { createStore } from "../../test";

import { MetronomeController } from "./metronome";

describe("MetronomeController", () => {
    describe("#start", () => {
        beforeEach(() => {
            // This is stubbed out in test/setup.ts. Restoring it allows us to re-stub it
            // within the tests as usual
            (window.setInterval as sinon.SinonStub).restore();
        });

        it("calls setInterval and sets the timerId", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const setInterval = sinon.stub(window, "setInterval");
            const id = 1;

            setInterval.returns(id as any);

            mc.start();

            assert(setInterval.calledOnce);
            assert.strictEqual(mc.timerId, id);
        });

        it("doesn't call setInterval if already started", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            mc.timerId = 1;
            const setInterval = sinon.stub(window, "setInterval");

            mc.start();

            assert(setInterval.notCalled);
        });
    });

    describe("#stop", () => {
        it("calls clearInterval when playing", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const clearInterval = sinon.stub(window, "clearInterval");
            const id = 1;

            mc.timerId = id;

            mc.stop();

            assert(clearInterval.calledOnceWith(id as any));
            assert.strictEqual(mc.timerId, 0);
        });

        it("doesn't call clearInterval if not playing", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const clearInterval = sinon.stub(window, "clearInterval");

            mc.stop();

            assert(clearInterval.notCalled);
        });
    });

    describe("#update", () => {
        it("sets the lastBeat attribute", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const beat = new Beat(1);

            mc.update(beat);
            assert.strictEqual(mc.lastBeat, beat);
        });

        it("emits a tick event if it's a whole beat", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const beat = new Beat(1);
            const spy = sinon.spy(store.ui.emitters.metronome, "emit");

            mc.update(beat);
            assert(spy.calledOnce);
        });

        it("emits a tick event if the beat crossed a whole beat", () => {
            const store = createStore();
            const mc = new MetronomeController(store);
            const spy = sinon.spy(store.ui.emitters.metronome, "emit");

            mc.update(new Beat(0.5));
            assert(spy.notCalled);

            mc.update(new Beat(1.5));
            assert(spy.calledOnce);
        });
    });
});

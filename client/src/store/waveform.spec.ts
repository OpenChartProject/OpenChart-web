import assert from "assert";
import sinon from "sinon";

import { createStore } from "../testUtil";

describe("WaveformStore", () => {
    describe("duration", () => {});
    describe("viewBox", () => {});
    describe("width", () => {});

    describe("#generateAll", () => {
        it("generates waveforms for each scale", () => {
            const store = createStore().waveform;
            const stub = sinon.stub(store, "generate");
            const els = store.generateAll();

            assert.strictEqual(els.length, store.scales.length);
            stub.getCalls().forEach((call, i) => {
                assert.strictEqual(call.firstArg, store.scales[i]);
            });
        });
    });

    describe("#generate", () => {
        it("throws an error if the waveform data has not yet been generated", () => {
            const store = createStore().waveform;
            assert.throws(() => store.generate(1));
        });
    });
    describe("#getBestMatchingWaveform", () => {});

    describe("#setAudioData", () => {
        it("generates the waveform then resolves", (done) => {
            const store = createStore().waveform;
            const fakeAudioData: any = {};
            const fakeWaveformData: any = {};

            sinon
                .stub(store, "generateWaveformData")
                .withArgs(fakeAudioData)
                .resolves(fakeWaveformData);

            store.setAudioData(fakeAudioData).then(() => {
                assert.strictEqual(store.data.waveform, fakeWaveformData);
                done();
            });
        });

        it("does not generate the waveform if the data is the same", (done) => {
            const store = createStore().waveform;
            const fakeAudioData: any = {};
            store.data.audioData = fakeAudioData;

            const spy = sinon.spy(store, "generateWaveformData");

            store.setAudioData(fakeAudioData).then(() => {
                assert(spy.notCalled);
                done();
            });
        });
    });
});

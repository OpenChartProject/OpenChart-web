import assert from "assert";
import sinon from "sinon";

import { createStore } from "../../testUtil";

import { MusicController } from "./music";

describe("MusicController", () => {
    describe("#play", () => {
        it("emits a play event", (done) => {
            const store = createStore().ui;
            const mc = new MusicController(store);

            store.emitters.music.on("play", done);
            mc.play();
        });
    });

    describe("#pause", () => {
        it("emits a pause event", (done) => {
            const store = createStore().ui;
            const mc = new MusicController(store);

            store.emitters.music.on("pause", done);
            mc.pause();
        });
    });

    describe("#seek", () => {
        it("emits a seek event", (done) => {
            const store = createStore().ui;
            const mc = new MusicController(store);
            const time = 1;

            store.emitters.music.on("seek", (val: number) => {
                assert.strictEqual(val, time);
                done();
            });

            mc.seek(time);
        });
    });

    describe("#setSource", () => {
        it("updates the store with the new music source", () => {
            const store = createStore().ui;
            const mc = new MusicController(store);
            const src = "test";

            mc.setSource(src);

            assert.strictEqual(store.data.music.src, src);
        });

        it("does not call update if the source is the same", () => {
            const store = createStore().ui;
            const mc = new MusicController(store);
            const spy = sinon.spy(store, "update");
            const src = "test";

            store.data.music.src = src;
            mc.setSource(src);
            assert(spy.notCalled);
        });
    });

    describe("#setVolume", () => {
        it("updates the store with the new volume", () => {
            const store = createStore().ui;
            const mc = new MusicController(store);
            const volume = 0.123;

            mc.setVolume(volume);

            assert.strictEqual(store.data.music.volume, volume);
        });

        it("does not call update if the volume is the same", () => {
            const store = createStore().ui;
            const mc = new MusicController(store);
            const spy = sinon.spy(store, "update");
            const volume = 0.123;

            store.data.music.volume = volume;
            mc.setVolume(volume);
            assert(spy.notCalled);
        });
    });
});

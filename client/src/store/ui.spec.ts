import assert from "assert";
import _ from "lodash";
import sinon from "sinon";

import Storage from "../storage";
import { createStore } from "../test";

import { MetronomeData, UIData, UIStore } from "./ui";

describe("UIStore", () => {
    const STORAGE_KEY = UIStore.STORAGE_KEY;

    beforeEach(() => {
        // Fallback to using the memory store so we don't need to do any stubbing.
        (localStorage as any) = null;
    });

    describe("new", () => {
        it("uses defaults when no saved settings are found", () => {
            const store = createStore().ui;

            assert.deepStrictEqual(store.data, store.defaults);
        });

        it("merges the defaults with saved settings", () => {
            const config: Partial<UIData> = {
                showWelcomeModal: false,
            };
            Storage.set(STORAGE_KEY, JSON.stringify(config));

            const store = createStore().ui;

            assert.deepStrictEqual(store.data, { ...store.defaults, ...config });
        });
    });

    describe("#activateTimePicker", () => {
        it("sets the time picker as active and sets the callbacks", () => {
            const onCancel = sinon.fake();
            const onPick = sinon.fake();
            const store = createStore().ui;

            store.activateTimePicker({ onCancel, onPick });

            const { timePicker } = store.tools;

            assert.strictEqual(timePicker.active, true);
            assert.strictEqual(timePicker.onCancel, onCancel);
            assert.strictEqual(timePicker.onPick, onPick);
        });
    });

    describe("#deactivateTimePicker", () => {
        it("sets the time picker as inactive and clears the callbacks", () => {
            const onCancel = sinon.fake();
            const onPick = sinon.fake();
            const store = createStore().ui;

            store.activateTimePicker({ onCancel, onPick });
            store.deactivateTimePicker();

            const { timePicker } = store.tools;

            assert.strictEqual(timePicker.active, false);
            assert(!timePicker.onCancel);
            assert(!timePicker.onPick);
        });
    });

    describe("#update", () => {
        it("merges the config", () => {
            const config: Partial<UIData> = {
                showWelcomeModal: false,
            };
            const store = createStore().ui;
            const before = _.cloneDeep(store.data);

            store.update(config);

            assert.notDeepStrictEqual(store.data, before);
            assert.deepStrictEqual(store.data, { ...before, ...config });
        });

        it("calls save", () => {
            const store = createStore().ui;
            const spy = sinon.spy(store, "save");

            store.update({});

            assert(spy.calledOnce);
        });
    });

    describe("#updateProperty", () => {
        it("updates the specified property", () => {
            const store = createStore().ui;
            const config: Partial<MetronomeData> = {
                volume: 0.123,
            };
            const before = _.cloneDeep(store.data);

            store.updateProperty("metronome", config);

            assert.notDeepStrictEqual(store.data, before);
            assert.deepStrictEqual(store.data.metronome, { ...before.metronome, ...config });
        });

        it("calls save", () => {
            const store = createStore().ui;
            const spy = sinon.spy(store, "save");

            store.updateProperty("metronome", {});

            assert(spy.calledOnce);
        });
    });

    describe("#save", () => {
        it("writes the data to Storage", () => {
            const store = createStore().ui;

            store.save();

            const expected = store.data;
            delete expected.music.src;
            delete (expected.panels.bpm as any).selected;
            const actual = JSON.parse(Storage.get(STORAGE_KEY) as string);

            assert.deepStrictEqual(actual, expected);
        });
    });

    describe("#setMusic", () => {
        it("sets the music source", () => {
            const store = createStore().ui;

            store.setMusic("foo");
            assert.strictEqual(store.data.music.src, "foo");
        });

        it("pauses the music", () => {
            const store = createStore().ui;
            const spy = sinon.spy(store.controllers.music, "pause");

            store.setMusic("foo");
            assert(spy.called);
        });
    });
});

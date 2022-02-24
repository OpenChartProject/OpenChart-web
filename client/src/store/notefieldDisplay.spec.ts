import assert from "assert";
import _ from "lodash";
import sinon from "sinon";

import Storage from "../storage";
import { createStore } from "../test";

import { BeatLineSettings, NotefieldDisplayData, NotefieldDisplayStore } from "./notefieldDisplay";

describe("NotefieldDisplayStore", () => {
    const STORAGE_KEY = NotefieldDisplayStore.STORAGE_KEY;

    beforeEach(() => {
        // Fallback to using the memory store so we don't need to do any stubbing.
        (localStorage as any) = null;
    });

    describe("new", () => {
        it("uses defaults when no saved settings are found", () => {
            const store = createStore().notefieldDisplay;

            assert.deepStrictEqual(store.data, store.defaults);
        });

        it("merges the defaults with saved settings", () => {
            const config: Partial<NotefieldDisplayData> = {
                columnWidth: 12345,
            };
            Storage.set(STORAGE_KEY, JSON.stringify(config));

            const store = createStore().notefieldDisplay;

            assert.deepStrictEqual(store.data, { ...store.defaults, ...config });
        });
    });

    describe("#update", () => {
        it("merges the config", () => {
            const config: Partial<NotefieldDisplayData> = {
                columnWidth: 12345,
            };
            const store = createStore().notefieldDisplay;
            const before = _.cloneDeep(store.data);

            store.update(config);

            assert.notDeepStrictEqual(store.data, before);
            assert.deepStrictEqual(store.data, { ...before, ...config });
        });

        it("calls updateWidth if the column width is included", () => {
            const config: Partial<NotefieldDisplayData> = {
                columnWidth: 12345,
            };
            const root = createStore();
            const store = root.notefieldDisplay;
            const spy = sinon.spy(root.notefield, "updateWidth");

            store.update(config);

            assert(spy.calledOnce);
        });

        it("does not call updateWidth if the column width is not included", () => {
            const root = createStore();
            const store = root.notefieldDisplay;
            const spy = sinon.spy(root.notefield, "updateWidth");

            store.update({});

            assert(spy.notCalled);
        });

        it("calls save", () => {
            const store = createStore().notefieldDisplay;
            const spy = sinon.spy(store, "save");

            store.update({});

            assert(spy.calledOnce);
        });
    });

    describe("#updateProperty", () => {
        it("updates the specified property", () => {
            const store = createStore().notefieldDisplay;
            const config: Partial<BeatLineSettings> = {
                measureLines: {
                    color: "foo",
                    lineWidth: 123,
                },
            };
            const before = _.cloneDeep(store.data);

            store.updateProperty("beatLines", config);

            assert.notDeepStrictEqual(store.data, before);
            assert.deepStrictEqual(store.data.beatLines, { ...before.beatLines, ...config });
        });

        it("calls save", () => {
            const store = createStore().notefieldDisplay;
            const spy = sinon.spy(store, "save");

            store.updateProperty("beatLines", {});

            assert(spy.calledOnce);
        });
    });

    describe("#save", () => {
        it("writes the data to Storage", () => {
            const store = createStore().notefieldDisplay;

            store.save();

            const expected = store.data;
            delete expected.noteSkin;
            const actual = JSON.parse(Storage.get(STORAGE_KEY) as string);

            assert.deepStrictEqual(actual, expected);
        });
    });
});

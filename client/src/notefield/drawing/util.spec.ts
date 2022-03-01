import assert from "assert";
import Fraction from "fraction.js";
import _ from "lodash";

import { Baseline, NotefieldData, NotefieldDisplayData } from "../../store";
import { createStore } from "../../test";

import { adjustToBaseline, scaleToWidth, timeToPosition } from "./util";

describe("notefield", () => {
    describe("#adjustToBaseline", () => {
        it("returns expected value when baseline is After", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.After;
            assert.strictEqual(adjustToBaseline(store.notefieldDisplay, 0, 50), 0);
        });

        it("returns expected value when baseline is Before and is upscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Before;
            assert.strictEqual(adjustToBaseline(store.notefieldDisplay, 0, 50), -50);
        });

        it("returns expected value when baseline is Before and is downscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Before;
            store.notefieldDisplay.data.scrollDirection = "down";
            assert.strictEqual(adjustToBaseline(store.notefieldDisplay, 0, 50), 50);
        });

        it("returns expected value when baseline is Centered and is upscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Centered;
            assert.strictEqual(adjustToBaseline(store.notefieldDisplay, 0, 50), -25);
        });

        it("returns expected value when baseline is Centered and is downscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Centered;
            store.notefieldDisplay.data.scrollDirection = "down";
            assert.strictEqual(adjustToBaseline(store.notefieldDisplay, 0, 50), 25);
        });
    });

    describe("#scaleToWidth", () => {
        it("returns expected value for 1:1 scaling", () => {
            assert.strictEqual(scaleToWidth(2, 4, 2), 4);
        });

        it("returns expected value for downscaling", () => {
            assert.strictEqual(scaleToWidth(4, 4, 2), 2);
        });

        it("returns expected value for upscaling", () => {
            assert.strictEqual(scaleToWidth(2, 2, 4), 4);
        });
    });

    describe("#timeToPosition", () => {
        it("returns expected value", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NotefieldData> = {
                zoom: new Fraction(1),
            };
            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            assert.strictEqual(timeToPosition(store.notefield, 0), 0);
            assert.strictEqual(
                timeToPosition(store.notefield, 1),
                store.notefieldDisplay.data.pixelsPerSecond,
            );
            assert.strictEqual(
                timeToPosition(store.notefield, 2),
                2 * store.notefieldDisplay.data.pixelsPerSecond,
            );
        });

        it("rounds to the nearest whole number", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NotefieldData> = {
                zoom: new Fraction(1.5),
            };
            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);
            assert.strictEqual(timeToPosition(store.notefield, 0.55), 83);
        });
    });
});

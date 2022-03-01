import assert from "assert";
import Fraction from "fraction.js";
import _ from "lodash";

import { Beat, Time } from "../../charting";
import { NotefieldData, NotefieldDisplayData } from "../../store";
import { createStore } from "../../test";

import { calculateViewport } from "./viewport";

describe("notefield", () => {
    describe("#calculateViewport", () => {
        it("returns expected value when scroll and receptorY are 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 0,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1),
            };
            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is > 1 and receptorY is 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 0,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(2),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2.5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is < 1 and receptorY is 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 0,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1, 2),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 10);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is > 1 and receptorY is > 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 100,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(2),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is < 1 and receptorY is > 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 100,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1, 2),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 8);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is 0 and receptorY is > 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 100,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 4);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is > 0 and receptorY is 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 0,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                zoom: new Fraction(1),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);
            store.notefield.setScroll({ time: new Time(1) });

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, 100);
            assert.strictEqual(t0.value, 1);
            assert.strictEqual(t1.value, 6);
            assert.strictEqual(tReceptor.value, 1);
        });

        it("returns expected value when scroll is > 0 and receptorY is > 0", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
                receptorY: 100,
            };
            const state: Partial<NotefieldData> = {
                height: 500,
                zoom: new Fraction(1),
            };

            const store = createStore();
            store.notefieldDisplay.data = _.merge(store.notefieldDisplay.data, config);
            store.notefield.data = _.merge(store.notefield.data, state);
            store.notefield.setScroll({ time: new Time(1) });

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.notefieldDisplay,
                store.notefield,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 1);
        });
    });
});

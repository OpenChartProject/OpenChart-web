import assert from "assert";
import Fraction from "fraction.js";
import _ from "lodash";

import { Beat, Time } from "../../charting";
import { Baseline, NotefieldData, NotefieldDisplayData } from "../../store";
import { createStore } from "../../test";

import {
    adjustToBaseline,
    calculateViewport,
    DrawProps,
    scaleToWidth,
    timeToPosition,
} from "./drawing";

describe("notefield", () => {
    describe("#adjustToBaseline", () => {
        it("returns expected value when baseline is After", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.After;
            const dp: Partial<DrawProps> = { notefieldDisplay: store.notefieldDisplay };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 0);
        });

        it("returns expected value when baseline is Before and is upscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Before;
            const dp: Partial<DrawProps> = { notefieldDisplay: store.notefieldDisplay };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), -50);
        });

        it("returns expected value when baseline is Before and is downscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Before;
            store.notefieldDisplay.data.scrollDirection = "down";
            const dp: Partial<DrawProps> = { notefieldDisplay: store.notefieldDisplay };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 50);
        });

        it("returns expected value when baseline is Centered and is upscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Centered;
            const dp: Partial<DrawProps> = { notefieldDisplay: store.notefieldDisplay };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), -25);
        });

        it("returns expected value when baseline is Centered and is downscroll", () => {
            const store = createStore();
            store.notefieldDisplay.data.baseline = Baseline.Centered;
            store.notefieldDisplay.data.scrollDirection = "down";
            const dp: Partial<DrawProps> = { notefieldDisplay: store.notefieldDisplay };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 25);
        });
    });

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
            const dp: Partial<DrawProps> = {
                notefieldDisplay: store.notefieldDisplay,
                notefield: store.notefield,
            };

            assert.strictEqual(timeToPosition(dp as DrawProps, 0), 0);
            assert.strictEqual(
                timeToPosition(dp as DrawProps, 1),
                store.notefieldDisplay.data.pixelsPerSecond,
            );
            assert.strictEqual(
                timeToPosition(dp as DrawProps, 2),
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
            const dp: Partial<DrawProps> = {
                notefieldDisplay: store.notefieldDisplay,
                notefield: store.notefield,
            };

            assert.strictEqual(timeToPosition(dp as DrawProps, 0.55), 83);
        });
    });
});

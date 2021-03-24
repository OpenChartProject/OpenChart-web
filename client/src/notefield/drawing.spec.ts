import assert from "assert";
import Fraction from "fraction.js";
import { Beat } from "../charting/beat";
import { Time } from "../charting/time";
import { createStore } from "../testutil";
import { Baseline } from "./config";

import {
    adjustToBaseline,
    calculateViewport,
    pps,
    scaleToWidth,
    timeToPosition,
} from "./drawing";

describe("notefield", () => {
    describe("#adjustToBaseline", () => {
        let dp: any;

        beforeEach(() => (dp = { config: {} }));

        it("returns expected value when baseline is After", () => {
            dp.config.baseline = Baseline.After;
            assert.strictEqual(adjustToBaseline(dp, 0, 50), 0);
        });

        it("returns expected value when baseline is Before", () => {
            dp.config.baseline = Baseline.Before;
            assert.strictEqual(adjustToBaseline(dp, 0, 50), -50);
        });

        it("returns expected value when baseline is Centered", () => {
            dp.config.baseline = Baseline.Centered;
            assert.strictEqual(adjustToBaseline(dp, 0, 50), -25);
        });
    });

    describe("#calculateViewport", () => {
        it("returns expected value when scroll and margin are 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(1),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scale is > 1 and margin is 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(2),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2.5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scale is < 1 and margin is 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(1, 2),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 10);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scale is > 1 and margin is > 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(2),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scale is < 1 and margin is > 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(1, 2),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 8);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is 0 and margin is > 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state = {
                height: 500,
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                scaleY: new Fraction(1),
            };

            const store = createStore({ config, state });
            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 4);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is > 0 and margin is 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state = {
                height: 500,
                scaleY: new Fraction(1),
            };

            const store = createStore({ config, state });
            store.setScroll({ time: new Time(1) });

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, 100);
            assert.strictEqual(t0.value, 1);
            assert.strictEqual(t1.value, 6);
            assert.strictEqual(tReceptor.value, 1);
        });

        it("returns expected value when scroll is > 0 and margin is > 0", () => {
            const config = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state = {
                height: 500,
                scaleY: new Fraction(1),
            };

            const store = createStore({ config, state });
            store.setScroll({ time: new Time(1) });

            const { y0, t0, t1, tReceptor } = calculateViewport(
                store.config,
                store.state,
            );

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 1);
        });
    });

    describe("#pps", () => {
        it("returns expected value for 1:1 scaling", () => {
            const config = {
                pixelsPerSecond: 100,
            };
            const state = {
                scaleY: new Fraction(1),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(pps(store.config, store.state), 100);
        });

        it("returns expected value for 2:1 scaling", () => {
            const config = {
                pixelsPerSecond: 100,
            };
            const state = {
                scaleY: new Fraction(2),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(pps(store.config, store.state), 200);
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
            const dp = {
                config: {
                    pixelsPerSecond: 100,
                },
                state: {
                    scaleY: new Fraction(1),
                },
            };
            assert.strictEqual(timeToPosition(dp as any, 0), 0);
            assert.strictEqual(
                timeToPosition(dp as any, 1),
                dp.config.pixelsPerSecond,
            );
            assert.strictEqual(
                timeToPosition(dp as any, 2),
                2 * dp.config.pixelsPerSecond,
            );
        });
    });
});

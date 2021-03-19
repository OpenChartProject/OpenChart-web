import assert from "assert";
import { Time } from "../charting/time";
import { Baseline } from "./config";

import {
    adjustToBaseline,
    calculateViewport,
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
                height: 500,
                pixelsPerSecond: 100,
                margin: 0,
                scroll: {
                    time: Time.Zero,
                },
            };
            const { y0, t0, t1, tReceptor } = calculateViewport(config as any);
            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is 0 and margin is >0", () => {
            const config = {
                height: 500,
                pixelsPerSecond: 100,
                margin: 100,
                scroll: {
                    time: Time.Zero,
                },
            };
            const { y0, t0, t1, tReceptor } = calculateViewport(config as any);
            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 4);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is >0 and margin is 0", () => {
            const config = {
                height: 500,
                pixelsPerSecond: 100,
                margin: 0,
                scroll: {
                    time: new Time(1),
                },
            };
            const { y0, t0, t1, tReceptor } = calculateViewport(config as any);
            assert.strictEqual(y0, 100);
            assert.strictEqual(t0.value, 1);
            assert.strictEqual(t1.value, 6);
            assert.strictEqual(tReceptor.value, 1);
        });

        it("returns expected value when scroll is >0 and margin is >0", () => {
            const config = {
                height: 500,
                pixelsPerSecond: 100,
                margin: 100,
                scroll: {
                    time: new Time(1),
                },
            };
            const { y0, t0, t1, tReceptor } = calculateViewport(config as any);
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
            const dp = {
                config: {
                    pixelsPerSecond: 100,
                },
            };
            assert.strictEqual(timeToPosition(dp as any, Time.Zero), 0);
            assert.strictEqual(
                timeToPosition(dp as any, new Time(1)),
                dp.config.pixelsPerSecond,
            );
            assert.strictEqual(
                timeToPosition(dp as any, new Time(2)),
                2 * dp.config.pixelsPerSecond,
            );
        });
    });
});

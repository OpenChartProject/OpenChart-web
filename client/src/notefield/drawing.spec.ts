import assert from "assert";
import { Time } from "../charting/time";

import { DrawProps, scaleToWidth, timeToPosition } from "./drawing";

describe("notefield", () => {
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
        let dp: any;
        const pps = 100;

        beforeEach(() => {
            dp = {
                config: {
                    pixelsPerSecond: pps,
                },
                t0: Time.Zero,
            };
        });

        it("returns 0 if scroll matches object position", () => {
            assert.strictEqual(timeToPosition(dp, dp.t0), 0);
        });

        it("returns positive values for times in the future", () => {
            assert.strictEqual(
                timeToPosition(dp, new Time(dp.t0.value + 1)),
                pps,
            );
        });

        it("returns negative values for times in the past", () => {
            dp.t0 = new Time(1);
            assert.strictEqual(timeToPosition(dp, Time.Zero), -pps);
        });
    });
});

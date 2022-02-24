import assert from "assert";

import { Tap as NativeTap } from "../../../charting/objects/";

import { Tap, TapConverter } from "./tap";

describe("oc/types", () => {
    describe("TapConverter", () => {
        describe("#toNative", () => {
            it("returns the expected native Tap object", () => {
                const data: Tap = {
                    beat: { f: "1/2", val: 0.5 },
                    key: 0,
                    type: "tap",
                };
                const expected = new NativeTap(data.beat.val, data.key);

                assert.deepStrictEqual(new TapConverter().toNative(data), expected);
            });
        });

        describe("#fromNative", () => {
            it("returns the expected Tap object", () => {
                const data = new NativeTap(0.5, 0);
                const expected: Tap = {
                    beat: { f: "1/2", val: 0.5 },
                    key: 0,
                    type: "tap",
                };

                assert.deepStrictEqual(new TapConverter().fromNative(data), expected);
            });
        });
    });
});

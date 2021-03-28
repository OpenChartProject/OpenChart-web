import assert from "assert";

import { Hold as NativeHold } from "../../../charting/objects/";

import { Hold, HoldConverter } from "./hold";

describe("oc/types", () => {
    describe("HoldConverter", () => {
        describe("#toNative", () => {
            it("returns the expected native Hold object", () => {
                const data: Hold = {
                    beat: { f: "1/2", val: 0.5 },
                    duration: { f: "2", val: 2 },
                    key: 0,
                    type: "hold",
                };
                const expected = new NativeHold(data.beat.val, data.duration.val, data.key);

                assert.deepStrictEqual(new HoldConverter().toNative(data), expected);
            });
        });

        describe("#fromNative", () => {
            it("returns the expected Hold object", () => {
                const data = new NativeHold(0.5, 2, 0);
                const expected: Hold = {
                    beat: { f: "1/2", val: 0.5 },
                    duration: { f: "2", val: 2 },
                    key: 0,
                    type: "hold",
                };

                assert.deepStrictEqual(new HoldConverter().fromNative(data), expected);
            });
        });
    });
});

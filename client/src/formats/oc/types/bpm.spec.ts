import assert from "assert";

import { BPM as NativeBPM } from "../../../charting/";

import { BPM, BPMConverter } from "./bpm";

describe("oc/types", () => {
    describe("BPMConverter", () => {
        describe("#toNative", () => {
            it("returns the expected native BPM object", () => {
                const data: BPM = {
                    beat: { f: "1/2", val: 0.5 },
                    val: 120,
                };
                const expected = new NativeBPM(data.beat.val, data.val);

                assert.deepStrictEqual(new BPMConverter().toNative(data), expected);
            });
        });

        describe("#fromNative", () => {
            it("returns the expected BPM object", () => {
                const data = new NativeBPM(0.5, 120);
                const expected: BPM = {
                    beat: { f: "1/2", val: 0.5 },
                    val: 120,
                };

                assert.deepStrictEqual(new BPMConverter().fromNative(data), expected);
            });
        });
    });
});

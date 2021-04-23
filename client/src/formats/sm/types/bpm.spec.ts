import assert from "assert";

import { BPM } from "../../../charting";

import { BPMConverter } from "./bpm";

describe("sm/types", () => {
    describe("BPMConverter", () => {
        describe("#toNative", () => {
            it("returns the expected native BPM", () => {
                const bpm = new BPMConverter().toNative({
                    beat: 0,
                    val: 120,
                });
                assert.strictEqual(bpm.beat.value, 0);
                assert.strictEqual(bpm.value, 120);
            });
        });

        describe("#fromNative", () => {
            it("returns the expected sm BPM", () => {
                const bpm = new BPMConverter().fromNative(new BPM(0, 120));
                assert.strictEqual(bpm.beat, 0);
                assert.strictEqual(bpm.val, 120);
            });
        });
    });
});

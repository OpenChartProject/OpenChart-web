import assert from "assert";

import { BPM } from "./bpm";

describe("BPM", () => {
    describe("set value", () => {
        it("throws if bpm is <= 0", () => {
            assert.throws(() => new BPM(0, 0));
        });
    });

    describe("#beatsPerSecond", () => {
        it("returns the expected value", () => {
            const bpm = new BPM(0, 120);
            assert.strictEqual(bpm.beatsPerSecond, 2);
        });
    });

    describe("#secondsPerBeat", () => {
        it("returns the expected value", () => {
            const bpm = new BPM(0, 120);
            assert.strictEqual(bpm.secondsPerBeat, 0.5);
        });
    });
});

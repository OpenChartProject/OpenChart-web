import assert from "assert";

import { Beat } from "./beat";
import { KeyCount } from "./keyCount";
import { KeyIndex } from "./keyIndex";
import { Time } from "./time";
import { toBeat, toBeatTime, toKeyCount, toKeyIndex, toTime } from "./util";

describe("charting/util", () => {
    describe("#toBeat", () => {
        it("returns same object when input is a Beat", () => {
            const beat = Beat.Zero;
            assert.strictEqual(toBeat(beat), beat);
        });

        it("returns new object when input is a number", () => {
            const beat = toBeat(0);
            assert.deepStrictEqual(beat, Beat.Zero);
        });
    });

    describe("#toBeatTime", () => {
        it("returns a beat time object", () => {
            const bt = toBeatTime(1, 2);
            assert.deepStrictEqual(bt.beat.value, 1);
            assert.deepStrictEqual(bt.time.value, 2);
        });
    });

    describe("#toKeyCount", () => {
        it("returns same object when input is a KeyCount", () => {
            const keyCount = new KeyCount(1);
            assert.strictEqual(toKeyCount(keyCount), keyCount);
        });

        it("returns new object when input is a number", () => {
            const keyCount = toKeyCount(1);
            assert.deepStrictEqual(keyCount, new KeyCount(1));
        });
    });

    describe("#toKeyIndex", () => {
        it("returns same object when input is a KeyIndex", () => {
            const keyIndex = new KeyIndex(0);
            assert.strictEqual(toKeyIndex(keyIndex), keyIndex);
        });

        it("returns new object when input is a number", () => {
            const keyIndex = toKeyIndex(0);
            assert.deepStrictEqual(keyIndex, new KeyIndex(0));
        });
    });

    describe("#toTime", () => {
        it("returns same object when input is a Time", () => {
            const time = Time.Zero;
            assert.strictEqual(toTime(time), time);
        });

        it("returns new object when input is a number", () => {
            const time = toTime(0);
            assert.deepStrictEqual(time, Time.Zero);
        });
    });
});

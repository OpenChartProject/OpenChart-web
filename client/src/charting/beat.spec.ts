import assert from "assert";
import Fraction from "fraction.js";
import { Beat } from "./beat";

describe("Beat", () => {
    describe("#isStartOfMeasure", () => {
        it("returns false if beat is not whole", () => {
            assert.strictEqual(new Beat(0.5).isStartOfMeasure(), false);
        });

        it("returns false if beat is not divisible by 4", () => {
            assert.strictEqual(new Beat(1).isStartOfMeasure(), false);
        });

        it("returns true if beat is whole and divisible by 4", () => {
            assert.strictEqual(Beat.Zero.isStartOfMeasure(), true);
            assert.strictEqual(new Beat(4).isStartOfMeasure(), true);
        });
    });

    describe("#isWholeBeat", () => {
        it("returns expected value", () => {
            assert.strictEqual(Beat.Zero.isWholeBeat(), true);
            assert.strictEqual(new Beat(1).isWholeBeat(), true);
            assert.strictEqual(new Beat(1.5).isWholeBeat(), false);
        });
    });

    describe("#next", () => {
        it("rounds up if it's not evenly divisible", () => {
            assert.strictEqual(new Beat(0.5).next(new Fraction(1)).value, 1);
            assert.strictEqual(
                new Beat(0.25).next(new Fraction(1, 2)).value,
                0.5,
            );
        });

        it("increases by step if it's evenly divisible", () => {
            assert.strictEqual(Beat.Zero.next(new Fraction(1)).value, 1);
            assert.strictEqual(
                new Beat(1).next(new Fraction(1, 4)).value,
                1.25,
            );
        });
    });
});

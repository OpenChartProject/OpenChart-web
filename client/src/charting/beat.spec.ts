import assert from "assert";
import Fraction from "fraction.js";

import { Beat } from "./beat";

describe("Beat", () => {
    describe("set fraction", () => {
        it("throws if value is negative", () => {
            assert.throws(() => new Beat(new Fraction(-1)));
            assert.throws(() => (new Beat(0).fraction = new Fraction(-1)));
        });
    });

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
});

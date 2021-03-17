import assert from "assert";
import { Beat } from "./beat";

describe("Beat", () => {
    describe("#isWholeBeat", () => {
        it("returns expected value", () => {
            assert.strictEqual(Beat.Zero.isWholeBeat(), true);
            assert.strictEqual(new Beat(1).isWholeBeat(), true);
            assert.strictEqual(new Beat(1.5).isWholeBeat(), false);
        });
    });

    describe("#next", () => {
        it("rounds up if the beat is not whole", () => {
            assert.strictEqual(new Beat(0.5).next().value, 1);
        });

        it("returns the next whole beat", () => {
            assert.strictEqual(Beat.Zero.next().value, 1);
            assert.strictEqual(new Beat(1).next().value, 2);
        });
    });
});

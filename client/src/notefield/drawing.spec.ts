import assert from "assert";

import { scaleToWidth } from "./drawing";

describe("notefield", () => {
    describe("#scaleToWidth", () => {
        it("returns expected results", () => {
            assert.strictEqual(scaleToWidth(1, 1, 2), 2);
            assert.strictEqual(scaleToWidth(64, 64, 128), 128);
            assert.strictEqual(scaleToWidth(128, 128, 64), 64);
            assert.strictEqual(scaleToWidth(64, 128, 64), 128);
        });
    });
});

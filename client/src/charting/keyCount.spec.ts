import assert from "assert";

import { KeyCount } from "./keyCount";

describe("#KeyCount", () => {
    it("throws if value is negative", () => {
        assert.throws(() => new KeyCount(-1));
        assert.throws(() => (new KeyCount(0).value = -1));
    });
});

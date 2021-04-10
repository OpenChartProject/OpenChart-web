import assert from "assert";

import { KeyIndex } from "./keyIndex";

describe("#KeyIndex", () => {
    it("throws if value is negative", () => {
        assert.throws(() => new KeyIndex(-1));
        assert.throws(() => (new KeyIndex(0).value = -1));
    });
});

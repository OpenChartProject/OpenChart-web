import assert from "assert";

import { Time } from "./time";

describe("#Time", () => {
    it("throws if value is negative", () => {
        assert.throws(() => new Time(-1));
        assert.throws(() => (new Time(0).value = -1));
    });
});

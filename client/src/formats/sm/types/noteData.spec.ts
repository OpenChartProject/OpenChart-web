import assert from "assert";

import { NoteDataConverter } from "./noteData";

describe("sm/types", () => {
    describe("#NoteDataConverter", () => {
        describe("#toNative", () => {
            it("returns an array with the same length as the key count", () => {
                assert.strictEqual(new NoteDataConverter(4).toNative([]).length, 4);
                assert.strictEqual(new NoteDataConverter(7).toNative([]).length, 7);
            });
        });
    });
});

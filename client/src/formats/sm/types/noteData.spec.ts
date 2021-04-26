import assert from "assert";
import { Tap } from "../../../charting/objects";

import { NoteDataConverter } from "./noteData";

describe("sm/types", () => {
    describe("#NoteDataConverter", () => {
        describe("#toNative", () => {
            it("returns an array with the same length as the key count", () => {
                assert.strictEqual(new NoteDataConverter(4).toNative([]).length, 4);
                assert.strictEqual(new NoteDataConverter(7).toNative([]).length, 7);
            });

            it("converts tap notes", () => {
                const input = ["1000", "0100", "0010", "0001"].join("");
                const native = new NoteDataConverter(4).toNative([input]);

                const expected = [
                    [new Tap(0, 0)],
                    [new Tap(0.25, 1)],
                    [new Tap(0.5, 2)],
                    [new Tap(0.75, 3)],
                ];

                assert.deepStrictEqual(native, expected);
            });
        });
    });
});

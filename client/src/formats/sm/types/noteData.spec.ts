import assert from "assert";

import { Hold, Tap } from "../../../charting/objects";

import { NoteDataConverter } from "./noteData";

describe("sm/types", () => {
    describe("#NoteDataConverter", () => {
        describe("#toNative", () => {
            it("throws if measure data is not evenly divisible by key count", () => {
                assert.throws(() => {
                    new NoteDataConverter(4).toNative(["000"]);
                });
            });

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

            it("converts holds", () => {
                const input = ["222", "300", "030", "003"].join("");
                const native = new NoteDataConverter(3).toNative([input]);

                const expected = [
                    [new Hold(0, 0.25, 0)],
                    [new Hold(0, 0.5, 1)],
                    [new Hold(0, 0.75, 2)],
                ];

                assert.deepStrictEqual(native, expected);
            });

            it("converts rolls to holds", () => {
                const input = ["444", "300", "030", "003"].join("");
                const native = new NoteDataConverter(3).toNative([input]);

                const expected = [
                    [new Hold(0, 0.25, 0)],
                    [new Hold(0, 0.5, 1)],
                    [new Hold(0, 0.75, 2)],
                ];

                assert.deepStrictEqual(native, expected);
            });

            it("ignores taps in the middle of a hold/roll", () => {
                const input = ["24", "11", "33", "00"].join("");
                const native = new NoteDataConverter(2).toNative([input]);

                const expected = [[new Hold(0, 0.5, 0)], [new Hold(0, 0.5, 1)]];

                assert.deepStrictEqual(native, expected);
            });

            it("ignores unsupported note types", () => {
                const input = "MKLFabcdefg98765".split("");
                const native = new NoteDataConverter(1).toNative(input);

                assert.deepStrictEqual(native, [[]]);
            });
        });
    });
});

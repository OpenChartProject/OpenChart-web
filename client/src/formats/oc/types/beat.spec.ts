import assert from "assert";
import Fraction from "fraction.js";

import { Beat as NativeBeat } from "../../../charting/";

import { Beat, BeatConverter } from "./beat";

describe("oc/types", () => {
    describe("BeatConverter", () => {
        describe("#toNative", () => {
            it("returns the expected native Beat object", () => {
                const data: Beat = {
                    f: "1/2",
                    val: 0.5,
                };
                const expected = new NativeBeat(new Fraction(1, 2));

                assert.deepStrictEqual(new BeatConverter().toNative(data), expected);
            });
        });

        describe("#fromNative", () => {
            it("returns the expected Beat object", () => {
                const data = new NativeBeat(new Fraction(1, 2));
                const expected: Beat = {
                    f: "1/2",
                    val: data.value,
                };

                assert.deepStrictEqual(new BeatConverter().fromNative(data), expected);
            });
        });
    });
});

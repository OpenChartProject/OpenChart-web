import assert from "assert";
import Fraction from "fraction.js";
import { Beat } from "../charting/beat";
import { BeatSnap } from "./beatsnap";

describe("BeatSnap", () => {
    describe("new", () => {
        it("sets a default snapping", () => {
            assert.deepStrictEqual(new BeatSnap().current, new Fraction(1, 4));
        });
    });

    describe("set current", () => {
        it("throws if the snap is lte zero", () => {
            assert.throws(() => new BeatSnap(new Fraction(0)));
            assert.throws(() => new BeatSnap(new Fraction(-1)));
        });
    });

    describe("#toBeat", () => {
        it("returns the expected value", () => {
            assert.deepStrictEqual(new BeatSnap().toBeat(), new Beat(1));
            assert.deepStrictEqual(
                new BeatSnap(new Fraction(1, 16)).toBeat(),
                new Beat(0.25),
            );
        });
    });
});

import assert from "assert";
import Fraction from "fraction.js";
import { Beat } from "../charting/beat";
import { BeatSnap, commonBeatSnaps } from "./beatsnap";

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

    describe("#isCommonSnap", () => {
        it("returns true for common beat snappings", () => {
            for (const snap of commonBeatSnaps) {
                assert(new BeatSnap(snap).isCommonSnap());
            }
        });

        it("returns false if beat snapping is not common", () => {
            assert(!new BeatSnap(new Fraction(1, 6)).isCommonSnap());
            assert(!new BeatSnap(new Fraction(3, 8)).isCommonSnap());
        });
    });

    describe("#nearestCommonSnapIndex", () => {
        it("returns expected index if snapping is common", () => {
            for (let i = 0; i < commonBeatSnaps.length; i++) {
                const snap = commonBeatSnaps[i];
                assert.strictEqual(
                    new BeatSnap(snap).nearestCommonSnapIndex(),
                    i,
                );
            }
        });

        it("returns nearest common snapping", () => {
            assert.strictEqual(
                new BeatSnap(new Fraction(1, 3)).nearestCommonSnapIndex(),
                0,
            );
            assert.strictEqual(
                new BeatSnap(new Fraction(1, 6)).nearestCommonSnapIndex(),
                1,
            );
            assert.strictEqual(
                new BeatSnap(new Fraction(1, 13)).nearestCommonSnapIndex(),
                2,
            );
        });
    });

    describe("#next", () => {
        it("jumps to next common snapping if not common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 5));
            beatSnap.next();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 8));
        });

        it("jumps to next common snapping if common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 4));
            beatSnap.next();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 8));
        });

        it("doesn't go out of range", () => {
            const snap = commonBeatSnaps[commonBeatSnaps.length - 1];
            const beatSnap = new BeatSnap(snap);
            beatSnap.next();
            assert.deepStrictEqual(beatSnap.current, snap);
        });
    });

    describe("#prev", () => {
        it("jumps to prev common snapping if not common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 5));
            beatSnap.prev();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 4));
        });

        it("jumps to prev common snapping if common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 8));
            beatSnap.prev();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 4));
        });

        it("doesn't go out of range", () => {
            const snap = commonBeatSnaps[0];
            const beatSnap = new BeatSnap(snap);
            beatSnap.prev();
            assert.deepStrictEqual(beatSnap.current, snap);
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

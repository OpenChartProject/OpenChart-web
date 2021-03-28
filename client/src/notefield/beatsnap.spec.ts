import assert from "assert";
import Fraction from "fraction.js";

import { Beat } from "../charting/";

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
                assert.strictEqual(new BeatSnap(snap).nearestCommonSnapIndex(), i);
            }
        });

        it("returns nearest common snapping", () => {
            assert.strictEqual(new BeatSnap(new Fraction(1, 3)).nearestCommonSnapIndex(), 0);
            assert.strictEqual(new BeatSnap(new Fraction(1, 6)).nearestCommonSnapIndex(), 1);
            assert.strictEqual(new BeatSnap(new Fraction(1, 13)).nearestCommonSnapIndex(), 2);
        });
    });

    describe("#nextBeat", () => {
        it("jumps to the first snap if the beat is zero", () => {
            const beatSnap = new BeatSnap();
            assert.deepStrictEqual(beatSnap.nextBeat(Beat.Zero), beatSnap.toBeat());
        });

        it("returns the next beat if beat is aligned with snap", () => {
            const beatSnap = new BeatSnap();
            assert.deepStrictEqual(beatSnap.nextBeat(new Beat(1)), new Beat(2));
        });

        it("returns the next beat if beat is not aligned with snap", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 12));
            assert.deepStrictEqual(beatSnap.nextBeat(new Beat(1.5)), new Beat(new Fraction(5, 3)));
        });
    });

    describe("#prevBeat", () => {
        it("doesn't go out of range", () => {
            const beatSnap = new BeatSnap();
            assert.deepStrictEqual(beatSnap.prevBeat(Beat.Zero), Beat.Zero);
        });

        it("returns the previous beat if beat is aligned with snap", () => {
            const beatSnap = new BeatSnap();
            assert.deepStrictEqual(beatSnap.prevBeat(new Beat(2)), new Beat(1));
        });

        it("returns the previous beat if beat is not aligned with snap", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 8));
            assert.deepStrictEqual(beatSnap.prevBeat(new Beat(new Fraction(5, 3))), new Beat(1.5));
        });
    });

    describe("#nextSnap", () => {
        it("jumps to next common snapping if not common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 5));
            beatSnap.nextSnap();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 8));
        });

        it("jumps to next common snapping if common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 4));
            beatSnap.nextSnap();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 8));
        });

        it("doesn't go out of range", () => {
            const snap = commonBeatSnaps[commonBeatSnaps.length - 1];
            const beatSnap = new BeatSnap(snap);
            beatSnap.nextSnap();
            assert.deepStrictEqual(beatSnap.current, snap);
        });
    });

    describe("#prevSnap", () => {
        it("jumps to prev common snapping if not common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 5));
            beatSnap.prevSnap();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 4));
        });

        it("jumps to prev common snapping if common", () => {
            const beatSnap = new BeatSnap(new Fraction(1, 8));
            beatSnap.prevSnap();
            assert.deepStrictEqual(beatSnap.current, new Fraction(1, 4));
        });

        it("doesn't go out of range", () => {
            const snap = commonBeatSnaps[0];
            const beatSnap = new BeatSnap(snap);
            beatSnap.prevSnap();
            assert.deepStrictEqual(beatSnap.current, snap);
        });
    });

    describe("#toBeat", () => {
        it("returns the expected value", () => {
            assert.deepStrictEqual(new BeatSnap().toBeat(), new Beat(1));
            assert.deepStrictEqual(new BeatSnap(new Fraction(1, 16)).toBeat(), new Beat(0.25));
        });
    });
});

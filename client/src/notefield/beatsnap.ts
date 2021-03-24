import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable } from "mobx";

import { Beat } from "../charting/beat";

/**
 * A list of common beat snap timings.
 */
export const commonBeatSnaps: Readonly<Fraction>[] = [
    new Fraction(1, 4),
    new Fraction(1, 8),
    new Fraction(1, 12),
    new Fraction(1, 16),
    new Fraction(1, 24),
    new Fraction(1, 32),
    new Fraction(1, 48),
    new Fraction(1, 64),
    new Fraction(1, 96),
    new Fraction(1, 192),
];

/**
 * Represents the current beat snapping.
 *
 * Beat snapping refers to how far the notefield moves when the user scrolls it.
 */
export class BeatSnap {
    private _current!: Fraction;

    constructor(current?: Fraction) {
        this.current = current ?? new Fraction(1, 4);
    }

    get current(): Fraction {
        return this._current;
    }

    set current(val: Fraction) {
        assert(
            val.compare(0) === 1,
            "beat snap value must be greater than zero",
        );
        this._current = val;
    }

    get beat(): Beat {
        return new Beat(this.current.mul(4));
    }

    /**
     * Returns true if this snapping matches one of the snaps defined in the
     * commonBeatSnaps list.
     */
    isCommonSnap(): boolean {
        return (
            commonBeatSnaps.findIndex((snap) => snap.equals(this.current)) !==
            -1
        );
    }

    /**
     * Returns the index from the commonBeatSnaps list that closest matches this beat
     * snapping.
     */
    nearestCommonSnapIndex(): number {
        let minDifference: Fraction | null = null;
        let nearestIndex = 0;

        for (let i = 0; i < commonBeatSnaps.length; i++) {
            const diff = commonBeatSnaps[i].sub(this.current).abs();

            if (minDifference === null || diff.compare(minDifference) === -1) {
                minDifference = diff;
                nearestIndex = i;
            }
        }

        return nearestIndex;
    }

    /**
     * Given a beat, returns the next beat that is evenly divisible by the current snap.
     */
    nextBeat(beat: Beat): Beat {
        let f: Fraction;

        if (beat.fraction.divisible(this.beat.fraction)) {
            f = beat.fraction.add(this.beat.fraction);
        } else {
            f = beat.fraction.div(this.beat.fraction).ceil();
        }

        return new Beat(f);
    }

    /**
     * Given a beat, returns the previous beat that is evenly divisible by the current snap.
     */
    prevBeat(beat: Beat): Beat {
        let f: Fraction;

        if (beat.fraction.divisible(this.beat.fraction)) {
            f = beat.fraction.sub(this.beat.fraction);

            if (f.compare(0) === -1) {
                f = new Fraction(0);
            }
        } else {
            f = beat.fraction.div(this.beat.fraction).floor();
        }

        return new Beat(f);
    }

    /**
     * Makes the beat snapping finer by moving to the next common beat snapping.
     */
    nextSnap() {
        let index = this.nearestCommonSnapIndex();

        if (commonBeatSnaps[index].compare(this.current) !== -1) {
            index++;
        }

        this.current =
            commonBeatSnaps[Math.min(index, commonBeatSnaps.length - 1)];
    }

    /**
     * Makes the beat snapping coarser by moving to the previous common beat snapping.
     */
    prevSnap() {
        let index = this.nearestCommonSnapIndex();

        if (commonBeatSnaps[index].compare(this.current) !== 1) {
            index--;
        }

        this.current = commonBeatSnaps[Math.max(index, 0)];
    }

    toBeat(): Beat {
        return new Beat(this.current.mul(4).valueOf());
    }
}

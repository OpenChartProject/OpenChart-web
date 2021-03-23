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
        makeAutoObservable(this);
        this.current = current ?? new Fraction(1, 4);
    }

    get current(): Fraction {
        return this._current;
    }

    set current(val: Fraction) {
        assert(val.valueOf() > 0, "beat snap value must be greater than zero");
        this._current = val;
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
        let minDifference = 999999999;
        let nearestIndex = 0;

        for (let i = 0; i < commonBeatSnaps.length; i++) {
            const diff = commonBeatSnaps[i].sub(this.current).abs().valueOf();

            if (diff < minDifference) {
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
        const f = new Fraction(beat.value).simplify();
        let div = f.div(this.current);
        const divCeil = div.ceil();

        if (divCeil.equals(div)) {
            div = div.add(1);
        } else {
            div = divCeil;
        }

        return new Beat(div.mul(this.current).mul(4).valueOf());
    }

    /**
     * Given a beat, returns the previous beat that is evenly divisible by the current snap.
     */
    prevBeat(beat: Beat): Beat {
        const f = new Fraction(beat.value).simplify();
        let div = f.div(this.current);
        const divFloor = div.floor();

        if (divFloor.equals(div)) {
            div = div.sub(1);
        } else {
            div = divFloor;
        }

        return new Beat(Math.max(div.mul(this.current).mul(4).valueOf(), 0));
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

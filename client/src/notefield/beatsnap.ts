import { Beat } from "../charting/beat";
import Fraction from "fraction.js";
import assert from "assert";

export class BeatSnap {
    private _current!: Fraction;

    constructor(current?: Fraction) {
        this.current = current ?? new Fraction(1, 4);
    }

    get current(): Fraction {
        return this._current;
    }

    set current(val: Fraction) {
        assert(val.valueOf() > 0, "beat snap value must be greater than zero");
        this._current = val;
    }

    toBeat(): Beat {
        return new Beat(this._current.mul(4).valueOf());
    }
}

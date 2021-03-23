import assert from "assert";
import { Time } from "./time";

/**
 * Represents a Beat and Time.
 */
export interface BeatTime {
    beat: Beat;
    time: Time;
}

/**
 * Represents a beat.
 */
export class Beat {
    private _value: number = 0;

    constructor(value: number) {
        this.value = value;
    }

    set value(val: number) {
        assert(val >= 0, "beat cannot be negative");
        this._value = val;
    }

    get value(): number {
        return this._value;
    }

    static get Zero(): Beat {
        return new Beat(0);
    }

    /**
     * Returns true if this beat is evenly divisible by 4.
     */
    isStartOfMeasure(): boolean {
        return this.isWholeBeat() && this.value % 4 === 0;
    }

    /**
     * Returns true if this beat is a whole number.
     */
    isWholeBeat(): boolean {
        return Math.round(this.value) === this.value;
    }

    /**
     * Jumps to the next whole beat and returns it.
     */
    next(): Beat {
        if (this.isWholeBeat()) {
            return new Beat(this.value + 1);
        }

        return new Beat(Math.ceil(this.value));
    }
}

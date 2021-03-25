import assert from "assert";
import Fraction from "fraction.js";
import { Time } from "./time";

/**
 * Represents a Beat and Time.
 */
export interface BeatTime {
    beat: Beat;
    time: Time;
}

/**
 * Represents a beat. Internally, beats are stored as fractions, which helps avoid the
 * issues of trying to compare floating point numbers.
 */
export class Beat {
    private _value!: Fraction;

    constructor(value: Fraction | number) {
        if (typeof value === "number") {
            this.value = value;
        } else {
            this.fraction = value;
        }
    }

    set value(val: number) {
        this.fraction = new Fraction(val);
    }

    /**
     * Gets the beat's value as a number.
     */
    get value(): number {
        return this._value.valueOf();
    }

    set fraction(val: Fraction) {
        assert(val.compare(0) !== -1, "beat cannot be negative");
        this._value = val;
    }

    /**
     * Gets the beat's value as a fraction.
     */
    get fraction(): Fraction {
        return this._value;
    }

    static get Zero(): Beat {
        return new Beat(0);
    }

    /**
     * Returns true if this beat is evenly divisible by 4.
     */
    isStartOfMeasure(): boolean {
        return this.fraction.divisible(new Fraction(4));
    }

    /**
     * Returns true if this beat is a whole number.
     */
    isWholeBeat(): boolean {
        return this.fraction.divisible(new Fraction(1));
    }
}

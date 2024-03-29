import assert from "assert";

/**
 * Represents a time in seconds.
 */
export class Time {
    private _value: number = 0;

    constructor(value: number) {
        this.value = value;
    }

    set value(val: number) {
        assert(val >= 0, "time cannot be negative");
        this._value = val;
    }

    get value(): number {
        return this._value;
    }

    static get Zero(): Time {
        return new Time(0);
    }
}

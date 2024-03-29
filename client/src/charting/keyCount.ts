import assert from "assert";

/**
 * Simple class for representing the number of keys in a chart.
 */
export class KeyCount {
    private _value: number = 0;

    constructor(value: number) {
        this.value = value;
    }

    set value(val: number) {
        assert(val > 0, "key count must be greater than 0");
        this._value = val;
    }

    get value(): number {
        return this._value;
    }
}

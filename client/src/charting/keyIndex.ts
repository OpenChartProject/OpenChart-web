import assert from "assert";

/**
 * Simple class for representing a particular key.
 */
export class KeyIndex {
    private _value: number = 0;

    constructor(value: number) {
        this.value = value;
    }

    set value(val: number) {
        assert(val >= 0, "key index cannot be negative");
        this._value = val;
    }

    get value(): number {
        return this._value;
    }
}

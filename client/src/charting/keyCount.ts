import * as assert from "assert";

export class KeyCount {
    private _value: number;

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

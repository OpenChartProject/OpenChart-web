import assert from "assert";

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

    static convert(val: number | Beat): Beat {
        if (val instanceof Beat) {
            return val;
        }

        return new Beat(val);
    }

    static get Zero(): Beat {
        return new Beat(0);
    }
}

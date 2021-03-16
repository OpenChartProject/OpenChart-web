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

    static get Zero(): Beat {
        return new Beat(0);
    }

    isWholeBeat(): boolean {
        return this.value - Math.floor(this.value) < 0.001;
    }

    next(): Beat {
        if (this.isWholeBeat()) {
            return new Beat(this.value + 1);
        }

        return new Beat(Math.ceil(this.value));
    }
}

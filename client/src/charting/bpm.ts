import assert from "assert";
import { Beat } from "./beat";

export class BPM {
    beat: Beat;
    private _value: number = 0;

    constructor(beat: Beat, value: number) {
        this.beat = beat;
        this.value = value;
    }

    beatsPerSecond(): number {
        return this.value / 60.0;
    }

    secondsPerBeat(): number {
        return 60.0 / this.value;
    }

    set value(val: number) {
        assert(val > 0, "bpm must be greater than 0");
        this._value = val;
    }

    get value(): number {
        return this._value;
    }
}

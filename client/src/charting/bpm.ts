import assert from "assert";

import { Beat } from "./beat";
import { toBeat } from "./util";

/**
 * Represents beats per minute.
 */
export class BPM {
    beat: Beat;
    private _value: number = 0;

    constructor(beat: Beat | number, value: number) {
        this.beat = toBeat(beat);
        this.value = value;
    }

    get beatsPerSecond(): number {
        return this.value / 60.0;
    }

    get secondsPerBeat(): number {
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

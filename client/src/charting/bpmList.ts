import assert from "assert";
import { Beat } from "./beat";
import { BPM } from "./bpm";
import { Time } from "./time";

export class BPMList {
    bpms: BPM[];

    constructor(bpms?: BPM[]) {
        this.bpms = bpms ?? [];
    }

    timeAt(beat: Beat): Time {
        assert(this.bpms.length > 0, "bpm list cannot be empty");

        let time = 0;

        for (let i = 0; i < this.bpms.length; i++) {
            const bpm = this.bpms[i];
            let end = 0;

            if (i < this.bpms.length - 1) {
                end = Math.min(this.bpms[i + 1].beat.value, beat.value);
            } else {
                end = beat.value;
            }

            time += (end - bpm.beat.value) * bpm.secondsPerBeat();

            if (end === beat.value)
                break;
        }

        return new Time(time);
    }
}

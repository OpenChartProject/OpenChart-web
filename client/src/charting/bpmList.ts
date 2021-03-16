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

        let cur = 0;
        let time = 0;

        return new Time(time);
    }
}

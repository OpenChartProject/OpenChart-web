import assert from "assert";
import _ from "lodash";

import { Beat } from "./beat";
import { BPM } from "./bpm";
import { Time } from "./time";

export class BPMList {
    private bpms: BPM[] = [];

    constructor(bpms?: BPM[]) {
        this.setBPMs(bpms ?? [new BPM(Beat.Zero, 120)]);
    }

    /**
     * Returns a deep clone of the BPMs.
     */
    getBPMS(): BPM[] {
        return _.cloneDeep(this.bpms);
    }

    /**
     * Updates the BPM changes.
     * @throws if the list is empty
     * @throws if the first bpm change is not at beat 0
     */
    setBPMs(bpms: BPM[]) {
        assert(bpms.length > 0, "bpm list cannot be empty");
        assert(
            bpms[0].beat.value === 0,
            "the first bpm change must be at beat 0"
        );
        this.bpms = bpms;
    }

    /**
     * Returns the time at a particular beat.
     */
    timeAt(beat: Beat): Time {
        let time = 0;

        for (let i = 0; i < this.bpms.length; i++) {
            const bpm = this.bpms[i];
            let end = 0;

            // If there is another BPM change after this we need to take that into
            // account, otherwise we can go straight to the target beat.
            if (i < this.bpms.length - 1) {
                end = Math.min(this.bpms[i + 1].beat.value, beat.value);
            } else {
                end = beat.value;
            }

            time += (end - bpm.beat.value) * bpm.secondsPerBeat();

            if (end === beat.value) break;
        }

        return new Time(time);
    }
}

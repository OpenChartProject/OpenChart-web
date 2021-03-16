import assert from "assert";
import _ from "lodash";

import { Beat } from "./beat";
import { BPM } from "./bpm";
import { Time } from "./time";

export interface BPMTime {
    bpm: BPM;
    time: Time;
}

export class BPMList {
    private bpms: BPMTime[] = [];

    constructor(bpms?: BPM[]) {
        this.setBPMs(bpms ?? [new BPM(Beat.Zero, 120)]);
    }

    /**
     * Returns the BPM changes.
     */
    getBPMS(): BPMTime[] {
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

        this.bpms = bpms.map(bpm => {
            return { bpm, time: Time.Zero };
        });

        for (const bpm of this.bpms) {
            bpm.time = this.timeAt(bpm.bpm.beat, false);
        }
    }

    /**
     * Returns the beat at a particular time.
     */
    beatAt(time: Time): Beat {
        let i = 1;

        // Use the cached BPM times to quickly find the BPM interval that the target
        // time is in.
        for (; i < this.bpms.length; i++) {
            if (this.bpms[i].time.value > time.value)
                break;
        }

        const bt = this.bpms[i - 1];

        return new Beat(bt.bpm.beat.value + (time.value - bt.time.value) * bt.bpm.beatsPerSecond());
    }

    /**
     * Returns the time at a particular beat.
     */
    timeAt(beat: Beat, cache = true): Time {
        if (!cache)
            return this.uncachedTimeAt(beat);

        let bt = this.bpms[0];

        // Use the cached BPM times to quickly find the BPM interval that the target
        // time is in.
        for (let i = 0; i < this.bpms.length - 1; i++) {
            const next = this.bpms[i + 1];

            if (next.bpm.beat.value >= beat.value)
                break;

            bt = next;
        }

        return new Time(bt.time.value + (beat.value - bt.bpm.beat.value) * bt.bpm.secondsPerBeat());
    }

    private uncachedTimeAt(beat: Beat): Time {
        let time = 0;

        for (let i = 0; i < this.bpms.length; i++) {
            const bt = this.bpms[i];
            let end = 0;

            // If there is another BPM change after this we need to take that into
            // account, otherwise we can go straight to the target beat.
            if (i < this.bpms.length - 1) {
                end = Math.min(this.bpms[i + 1].bpm.beat.value, beat.value);
            } else {
                end = beat.value;
            }

            time += (end - bt.bpm.beat.value) * bt.bpm.secondsPerBeat();

            if (end === beat.value) break;
        }

        return new Time(time);
    }
}

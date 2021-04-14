import assert from "assert";
import _ from "lodash";
import { makeAutoObservable } from "mobx";

import { Beat } from "./beat";
import { BPM } from "./bpm";
import { Time } from "./time";
import { toBeat, toTime } from "./util";

/**
 * Represents a BPM change at a point in time.
 */
export interface BPMTime {
    bpm: BPM;
    time: Time;
}

/**
 * Stores a list of BPMs and provides methods for converting between beats/time.
 */
export class BPMList {
    private bpms: BPMTime[] = [];

    constructor(bpms?: BPM[]) {
        makeAutoObservable(this);
        this.setBPMs(bpms ?? [new BPM(Beat.Zero, 120)]);
    }

    /**
     * Returns the beat at a particular time.
     */
    beatAt(time: Time | number): Beat {
        time = toTime(time);
        let i = 1;

        // Use the cached BPM times to quickly find the BPM interval that the target
        // time is in.
        for (; i < this.bpms.length; i++) {
            if (this.bpms[i].time.value > time.value) break;
        }

        const bt = this.bpms[i - 1];

        return new Beat(bt.bpm.beat.value + (time.value - bt.time.value) * bt.bpm.beatsPerSecond);
    }

    /**
     * Returns a copy of the BPM that is at the given index.
     */
    get(index: number): BPMTime {
        assert(index >= 0 && index < this.bpms.length, "index is out of range");

        return _.cloneDeep(this.bpms[index]);
    }

    /**
     * Returns a copy of all the BPMs.
     */
    getAll(): BPMTime[] {
        return _.cloneDeep(this.bpms);
    }

    /**
     * Updates the BPM changes.
     * @throws if the list is empty
     * @throws if the first bpm change is not at beat 0
     */
    setBPMs(bpms: BPM[]) {
        assert(bpms.length > 0, "bpm list cannot be empty");

        bpms = this.clean(bpms);
        this.bpms = bpms.map((x) => ({ bpm: x, time: Time.Zero }));

        this.recalculateTimes();
    }

    /**
     * Returns the time at a particular beat.
     */
    timeAt(beat: Beat | number, cache = true): Time {
        beat = toBeat(beat);

        if (!cache) {
            return this.uncachedTimeAt(beat);
        }

        let bt = this.bpms[0];

        for (let i = 0; i < this.bpms.length - 1; i++) {
            const next = this.bpms[i + 1];

            if (next.bpm.beat.value >= beat.value) break;

            bt = next;
        }

        return new Time(bt.time.value + (beat.value - bt.bpm.beat.value) * bt.bpm.secondsPerBeat);
    }

    /**
     * Updates the BPM at the given index.
     */
    update(index: number, bpm: BPM) {
        assert(index >= 0 && index < this.bpms.length, "index is out of range");

        // Create a copy of the bpms just in case clean() throws an exception.
        const copy = _.cloneDeep(this.bpms.map((x) => x.bpm));
        copy[index] = bpm;

        this.clean(copy);
        this.bpms = copy.map((x) => ({ bpm: x, time: Time.Zero }));
        this.recalculateTimes();
    }

    /**
     * Cleans the list of BPMs by sorting them and removing duplicates. Throws if none
     * of the BPM changes occur at beat 0.
     */
    private clean(bpms: BPM[]): BPM[] {
        const sorted = this.sortByBeat(bpms);

        assert(sorted[0].beat.value === 0, "there must be a bpm set at beat 0");

        const duplicates: number[] = [];

        // Compare each bpm with the previous to see if it's a duplicate.
        for (let i = 1; i < sorted.length; i++) {
            const a = sorted[i - 1];
            const b = sorted[i];

            if (a.beat.fraction.equals(b.beat.fraction) || a.value === b.value) {
                duplicates.push(i);
            }
        }

        // Remove the duplicates in reverse order so we keep the order of the indicies.
        duplicates.reverse();

        for (const i of duplicates) {
            sorted.splice(i, 1);
        }

        return sorted;
    }

    /**
     * Recalculates the times for each BPM.
     */
    private recalculateTimes() {
        for (const bpm of this.bpms) {
            bpm.time = this.timeAt(bpm.bpm.beat, false);
        }
    }

    /**
     * Sorts the provided bpms by beat and returns it.
     */
    private sortByBeat(bpms: BPM[]): BPM[] {
        const copy = _.clone(bpms);
        return copy.sort((a, b) => (a.beat.value < b.beat.value ? -1 : 1));
    }

    /**
     * This calcuates the time a beat occurs at by going through each BPM and
     * calculating what time that BPM change occurs.
     */
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

            time += (end - bt.bpm.beat.value) * bt.bpm.secondsPerBeat;

            if (end === beat.value) break;
        }

        return new Time(time);
    }
}

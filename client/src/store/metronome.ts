import { Beat } from "../charting";

import { UIStore } from "./ui";

/**
 * This handles playing the metronome ticks while the chart is playing.
 */
export class Metronome {
    lastBeat?: Beat;
    store: UIStore;

    constructor(store: UIStore) {
        this.store = store;
    }

    /**
     * This calculates if the metronome should tick or not based on the provided beat.
     * The metronome only ticks on whole beats and when it crosses a "beat boundary".
     */
    update(beat: Beat) {
        if (!this.lastBeat) {
            this.lastBeat = beat;
        }

        if (beat.isWholeBeat() || Math.floor(beat.value) > this.lastBeat.value) {
            this.store.onTick();
        }

        this.lastBeat = beat;
    }
}

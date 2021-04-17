import { Beat } from "../../charting";
import { RootStore } from "../root";

// How often to check if the metronome should tick, in ms.
const timerInterval = 20;

/**
 * This handles playing the metronome ticks while the chart is playing.
 */
export class MetronomeController {
    lastBeat?: Beat;
    timerId: number;
    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;
        this.timerId = 0;
    }

    /**
     * Starts the metronome. This starts an interval which checks periodically if the
     * metronome should play a tick.
     */
    start() {
        // The metronome is already running
        if (this.timerId !== 0) {
            return;
        }

        const { notefield } = this.store;

        this.timerId = window.setInterval(() => {
            this.update(notefield.data.scroll.beat);
        }, timerInterval);
    }

    /**
     * Stops the metronome.
     */
    stop() {
        // The metronome is already stopped
        if (this.timerId === 0) {
            return;
        }

        clearInterval(this.timerId);
    }

    /**
     * This calculates if the metronome should tick or not based on the provided beat.
     * The metronome only ticks on whole beats and when it crosses a "beat boundary".
     */
    update(beat: Beat) {
        const { ui } = this.store;

        if (!this.lastBeat) {
            this.lastBeat = beat;
        }

        if (beat.isWholeBeat() || Math.floor(beat.value) > this.lastBeat.value) {
            ui.emitters.metronome.emit("tick");
        }

        this.lastBeat = beat;
    }
}

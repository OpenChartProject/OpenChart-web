import { Beat } from "../../charting";
import { RootStore } from "../root";

/**
 * This handles playing the metronome ticks while the chart is playing.
 *
 * This metronome was adapted from a really great blog post by Monica D.
 * https://meowni.ca/posts/metronomes/
 */
export class MetronomeController {
    ctx?: AudioContext;
    osc?: OscillatorNode;
    gain?: GainNode;

    lastBeat?: Beat;
    playing: boolean;
    store: RootStore;

    /**
     * The frequency of the metornome tick, in Hz
     */
    readonly FREQUENCY = 600;

    /**
     * How long the tick should last, in seconds
     */
    readonly TICK_TIME = 0.02;

    constructor(store: RootStore) {
        this.store = store;
        this.playing = false;
    }

    clickAt(time: number) {
        const { gain } = this.gain!;

        gain.cancelScheduledValues(time);
        gain.setValueAtTime(0, time);

        gain.linearRampToValueAtTime(1, time + 0.001);
        gain.linearRampToValueAtTime(0, time + 0.001 + this.TICK_TIME);
    }

    setUp() {
        this.ctx = new AudioContext();
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();

        this.osc.type = "sine";
        this.osc.frequency.value = this.FREQUENCY;

        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
    }

    /**
     * Starts the metronome.
     */
    start() {
        if (this.playing) {
            return;
        }

        this.setUp();

        // TODO: look ahead at beats and use those times to tick the metronome
        for (let i = 0; i < 1000; i++) {
            this.clickAt(i);
        }

        this.osc!.start(0);
        this.playing = true;
    }

    /**
     * Stops the metronome.
     */
    stop() {
        if (!this.playing) {
            return;
        }

        this.playing = false;
        this.tearDown();
    }

    tearDown() {
        if (this.osc) {
            this.osc!.stop();
        }

        this.osc = undefined;
        this.gain = undefined;
        this.ctx = undefined;
    }
}

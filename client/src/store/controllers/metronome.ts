import { getBeatLineTimes } from "../../notefield/beatlines";
import { BeatSnap } from "../../notefield/beatsnap";
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
    tickGain?: GainNode;
    outGain?: GainNode;

    muted: boolean;
    playing: boolean;
    store: RootStore;
    volume: number;

    /**
     * The frequency of the metornome tick, in Hz
     */
    readonly FREQUENCY = 1000;

    /**
     * How long the tick should last, in seconds
     */
    readonly TICK_TIME = 0.02;

    constructor(store: RootStore) {
        this.store = store;
        this.playing = false;
        this.volume = 1;
        this.muted = false;
    }

    adjustOutputGain() {
        if (!this.outGain) {
            return;
        }

        this.outGain.gain.value = this.muted ? 0 : Math.pow(this.volume, 2);
    }

    /**
     * Creates the audio nodes we need to make the metronome work.
     *
     * The metronome sound itself is just a sine wave, and we basically "flick" the gain
     * knob up when the tick should play.
     */
    setUp() {
        this.ctx = new AudioContext();
        this.osc = this.ctx.createOscillator();
        this.tickGain = this.ctx.createGain();
        this.outGain = this.ctx.createGain();

        this.osc.type = "sine";
        this.osc.frequency.value = this.FREQUENCY;
        this.tickGain.gain.value = 0;

        this.osc.connect(this.tickGain);
        this.tickGain.connect(this.outGain);
        this.outGain.connect(this.ctx.destination);

        this.adjustOutputGain();
    }

    setMuted(muted: boolean) {
        this.muted = muted;
        this.adjustOutputGain();
    }

    /**
     * Sets the volume of the metronome. The value should be between [0, 1]
     */
    setVolume(val: number) {
        this.volume = val;
        this.adjustOutputGain();
    }

    /**
     * Starts the metronome. This sets up the audio nodes and schedules the metronome ticks
     * ahead of time.
     */
    start() {
        if (this.playing) {
            return;
        }

        this.setUp();

        // Set some limits to how many ticks we want to schedule.
        const limit = {
            // The max number of ticks we will schedule
            count: 1000,

            // The max number of seconds we will schedule
            seconds: 300,
        };

        let count = 0;
        const { chart, scroll } = this.store.notefield.data;

        // TODO: Should probably refactor this so we aren't using beat line code lol
        for (const bt of getBeatLineTimes(
            chart,
            new BeatSnap(),
            scroll.time.value,
            scroll.time.value + limit.seconds,
        )) {
            if (count++ >= limit.count) {
                break;
            }

            this.tickAt(bt.time.value - scroll.time.value, bt.beat.isStartOfMeasure());
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

    /**
     * Cleans up the audio nodes.
     */
    tearDown() {
        this.ctx?.close();

        this.osc = undefined;
        this.tickGain = undefined;
        this.ctx = undefined;
    }

    /**
     * Schedules a metronome tick at the given time. The tick is louder when the beat is
     * the start of a measure.
     */
    tickAt(time: number, startOfMeasure: boolean) {
        const { gain } = this.tickGain!;
        const volume = startOfMeasure ? 1 : 0.25;

        gain.cancelScheduledValues(time);
        gain.setValueAtTime(0, time);

        gain.linearRampToValueAtTime(volume, time + 0.001);
        gain.linearRampToValueAtTime(0, time + 0.001 + this.TICK_TIME);
    }
}

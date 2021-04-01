import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting";
import { NoteFieldState } from "../notefield/config";

import { AutoScroller } from "./autoScroller";
import { Music } from "./music";

export const zoom = {
    min: new Fraction(256, 6561),
    max: new Fraction(6561, 256),
};

/**
 * This store contains all the state for a notefield. Each notefield has its own instance
 * of the NoteFieldStore.
 */
export class NoteFieldStore {
    chart: Chart;
    state: NoteFieldState;
    canvas?: HTMLCanvasElement;

    autoScroller: AutoScroller;
    music: Music;

    constructor(state: NoteFieldState, chart: Chart, canvas?: HTMLCanvasElement) {
        makeAutoObservable(this, {
            canvas: false,
            autoScroller: false,
            music: false,
        });
        this.chart = chart;
        this.state = state;
        this.canvas = canvas;

        this.autoScroller = new AutoScroller(this);
        this.music = new Music();
    }

    /**
     * Resets the scroll and zoom to the default.
     */
    resetView() {
        this.setScroll({ time: Time.Zero });
        this.setZoom(new Fraction(1));
    }

    /**
     * Scrolls the notefield relative to its current position, based on the
     * provided beat/time deltas.
     */
    scrollBy({ beat, time }: { beat?: number; time?: number }) {
        if (beat !== undefined) {
            let dst = this.state.scroll.beat.fraction.add(beat);

            if (dst.compare(0) === -1) {
                dst = new Fraction(0);
            }

            this.setScroll({ beat: new Beat(dst) });
        } else if (time !== undefined) {
            this.setScroll({
                time: new Time(Math.max(time + this.state.scroll.time.value, 0)),
            });
        } else {
            throw Error("beat or time must be set");
        }
    }

    /**
     * Sets the chart being rendered by the notefield.
     */
    setChart(chart: Chart) {
        this.chart = chart;
        this.resetView();
    }

    /**
     * Updates the render height of the notefield.
     */
    setHeight(height: number) {
        // Only update the height if we need to, since the canvas is cleared each time.
        if (height !== this.state.height) {
            if (this.canvas) {
                this.canvas.height = height;
            }

            this.state.height = height;
        }
    }

    /**
     * Sets the music source.
     */
    setMusic(src: string) {
        this.music.setSource(src);
        this.setPlaying(false);
    }

    /**
     * Sets the notefield as playing or paused. While playing, the notefield scrolls
     * automatically, and plays music.
     */
    setPlaying(isPlaying: boolean) {
        if (isPlaying !== this.state.isPlaying) {
            this.state.isPlaying = isPlaying;

            if (isPlaying) {
                this.autoScroller.start();
                this.music.playAt(this.state.scroll.time.value);
            } else {
                this.music.pause();
            }
        }
    }

    /**
     * Sets the scroll position to a specific beat/time.
     */
    setScroll({ beat, time }: Partial<BeatTime>) {
        if (beat !== undefined) {
            time = this.chart.bpms.timeAt(beat);
            this.state.scroll = { beat, time };
        } else if (time !== undefined) {
            beat = this.chart.bpms.beatAt(time);
            this.state.scroll = { beat, time };
        } else {
            throw Error("beat or time must be set");
        }
    }

    /**
     * Sets the notefield zoom.
     */
    setZoom(to: Fraction) {
        assert(to.compare(0) === 1, "zoom must be greater than zero");

        let val = to;

        if (val.compare(zoom.max) === 1) {
            val = zoom.max;
        } else if (val.compare(zoom.min) === -1) {
            val = zoom.min;
        }

        if (!this.state.zoom.equals(val)) {
            this.state.zoom = val;
        }
    }
}

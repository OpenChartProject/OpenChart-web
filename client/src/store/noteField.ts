import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting";
import { BeatSnap } from "../notefield/beatsnap";

import { AutoScroller } from "./autoScroller";
import { Music } from "./music";
import { RootStore } from "./store";

export const zoom = {
    min: new Fraction(256, 6561),
    max: new Fraction(6561, 256),
};

export interface NoteFieldState {
    zoom: Fraction;
    scroll: BeatTime;
    snap: BeatSnap;

    audio?: HTMLAudioElement;
    isPlaying: boolean;
}

/**
 * This store contains all the state for a notefield. Each notefield has its own instance
 * of the NoteFieldStore.
 */
export class NoteFieldStore {
    readonly root: RootStore;

    chart?: Chart;
    readonly state: NoteFieldState;
    canvas?: HTMLCanvasElement;

    readonly autoScroller: AutoScroller;
    readonly music: Music;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            defaults: false,
            canvas: false,
            autoScroller: false,
            music: false,
        });

        this.root = root;
        this.state = this.defaults;
        this.autoScroller = new AutoScroller(this.root);
        this.music = new Music();
    }

    get defaults(): NoteFieldState {
        return {
            zoom: new Fraction(1),
            scroll: { beat: Beat.Zero, time: Time.Zero },
            snap: new BeatSnap(),

            isPlaying: false,
        };
    }

    get height(): number {
        if (!this.canvas) {
            return 1;
        }

        return this.canvas.clientHeight;
    }

    get width(): number {
        if (!this.chart) {
            return 1;
        }

        return this.root.editor.config.columnWidth * this.chart.keyCount.value;
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

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    /**
     * Sets the chart being rendered by the notefield.
     */
    setChart(chart: Chart) {
        this.chart = chart;
        this.resetView();
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
        assert(this.chart, "chart cannot be undefined");

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

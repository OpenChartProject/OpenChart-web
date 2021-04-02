import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting";
import { BeatSnap } from "../notefield/beatsnap";

import { AutoScroller } from "./autoScroller";
import { Music } from "./music";
import { RootStore } from "./store";

export const zoom = {
    min: new Fraction(256, 6561),
    max: new Fraction(6561, 256),
};

export interface NoteFieldData {
    // This is a bit redundant since the width and height always match the dimensions of
    // the canvas element, but without them mobx doesn't respond to them changing.
    width: number;
    height: number;

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

    chart: Chart;
    data: NoteFieldData;
    canvas?: HTMLCanvasElement;

    readonly autoScroller: AutoScroller;
    readonly music: Music;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            autoScroller: false,
            canvas: observable.ref,
            defaults: false,
            music: false,
            root: false,
        });

        this.root = root;

        // Always start with a blank chart so we don't need to worry about passing a chart
        // in during init.
        this.chart = new Chart();

        this.data = makeAutoObservable(this.defaults, {
            zoom: observable.ref,
        });

        this.autoScroller = new AutoScroller(this.root);
        this.music = new Music();
    }

    get defaults(): NoteFieldData {
        return {
            width: 1,
            height: 1,

            zoom: new Fraction(1),
            scroll: { beat: Beat.Zero, time: Time.Zero },
            snap: new BeatSnap(),

            isPlaying: false,
        };
    }

    /**
     * Sets the height of the canvas. The height is controlled by the CSS, and a listener
     * calls this method when the height in the DOM changes.
     */
    setHeight(val: number) {
        if (!this.canvas || this.canvas.height === val) {
            return;
        }

        this.canvas.height = val;
        this.data.height = this.canvas.height;
    }

    /**
     * Updates the canvas width.
     */
    updateWidth() {
        const width = this.root.editor.data.columnWidth * this.chart.keyCount.value;

        if (!this.canvas || this.canvas.width === width) {
            return;
        }

        this.canvas.width = width;
        this.data.width = this.canvas.width;
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
            let dst = this.data.scroll.beat.fraction.add(beat);

            if (dst.compare(0) === -1) {
                dst = new Fraction(0);
            }

            this.setScroll({ beat: new Beat(dst) });
        } else if (time !== undefined) {
            this.setScroll({
                time: new Time(Math.max(time + this.data.scroll.time.value, 0)),
            });
        } else {
            throw Error("beat or time must be set");
        }
    }

    /**
     * Sets the canvas element and sets its render width.
     */
    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.updateWidth();
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
        if (isPlaying !== this.data.isPlaying) {
            this.data.isPlaying = isPlaying;

            if (isPlaying) {
                this.autoScroller.start();
                this.music.playAt(this.data.scroll.time.value);
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
            this.data.scroll = { beat, time };
        } else if (time !== undefined) {
            beat = this.chart.bpms.beatAt(time);
            this.data.scroll = { beat, time };
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

        if (!this.data.zoom.equals(val)) {
            this.data.zoom = val;
        }
    }
}

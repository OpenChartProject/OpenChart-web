import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting";
import { BeatSnap } from "../notefield/beatsnap";
import { NotefieldDrawData } from "../notefield/drawing/drawData";

import { AutoScrollController } from "./controllers";
import { RootStore } from "./root";

export const ZOOM_MIN = new Fraction(256, 6561);
export const ZOOM_MAX = new Fraction(6561, 256);

/**
 * The state of a notefield. For the notefield look and feel, see `NotefieldDisplayData`
 */
export interface NotefieldData {
    // These always match the canvas width and height.
    width: number;
    height: number;

    chart: Chart;

    zoom: Fraction;
    scroll: BeatTime;
    snap: BeatSnap;

    isPlaying: boolean;

    drawData?: NotefieldDrawData;
}

/**
 * This store manages the state of a notefield.
 *
 * Every notefield has its own `NotefieldStore`, but all notefields share the same
 * `NotefieldDisplayStore`.
 */
export class NotefieldStore {
    readonly root: RootStore;

    data: NotefieldData;
    canvas?: HTMLCanvasElement;

    readonly autoScroller: AutoScrollController;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            autoScroller: false,
            canvas: observable.ref,
            defaults: false,
            root: false,
        });

        this.root = root;

        this.data = makeAutoObservable(this.defaults, {
            zoom: observable.ref,
        });

        this.autoScroller = new AutoScrollController(this.root);
    }

    get defaults(): NotefieldData {
        return {
            width: 1,
            height: 1,

            chart: new Chart(),

            zoom: new Fraction(1),
            scroll: { beat: Beat.Zero, time: Time.Zero },
            snap: new BeatSnap(),

            isPlaying: false,
        };
    }

    /**
     * Returns the pixels per second, taking into account the scaling.
     */
    get pixelsPerSecond(): number {
        return this.root.notefieldDisplay.data.pixelsPerSecond * this.data.zoom.valueOf();
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
        assert(beat !== undefined || time !== undefined, "beat or time must be set");

        if (beat) {
            let dst = this.data.scroll.beat.fraction.add(beat);

            if (dst.compare(0) === -1) {
                dst = new Fraction(0);
            }

            this.setScroll({ beat: new Beat(dst) });
        } else if (time) {
            this.setScroll({
                time: new Time(Math.max(time + this.data.scroll.time.value, 0)),
            });
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
        this.data.chart = chart;
        this.resetView();
    }

    setDrawData(drawData: NotefieldDrawData) {
        this.data.drawData = drawData;
    }

    /**
     * Sets the height of the canvas. The height is controlled by the CSS, and a listener
     * calls this method when the height in the DOM changes.
     */
    setHeight(val: number) {
        assert(this.canvas, "canvas must be set before calling setHeight");

        if (this.canvas.height === val) {
            return;
        }

        this.canvas.height = val;
        this.data.height = this.canvas.height;
    }

    /**
     * Sets the notefield as playing or paused. While playing, the notefield scrolls
     * automatically, and plays music.
     */
    setPlaying(isPlaying: boolean) {
        if (isPlaying !== this.data.isPlaying) {
            this.data.isPlaying = isPlaying;
            const { metronome, music } = this.root.ui.controllers;

            if (isPlaying) {
                this.autoScroller.start();
                metronome.start();
                music.seek(this.data.scroll.time.value);
                music.play();
            } else {
                metronome.stop();
                music.pause();
            }
        }
    }

    /**
     * Sets the scroll position to a specific beat/time.
     */
    setScroll({ beat, time }: Partial<BeatTime>) {
        assert(beat || time, "beat or time must be set");

        const { bpms } = this.data.chart;

        if (beat) {
            time = bpms.timeAt(beat);
            this.data.scroll = { beat, time };
        } else if (time) {
            beat = bpms.beatAt(time);
            this.data.scroll = { beat, time };
        }
    }

    /**
     * Sets the notefield zoom.
     */
    setZoom(to: Fraction) {
        assert(to.compare(0) === 1, "zoom must be greater than zero");

        let val = to;

        if (val.compare(ZOOM_MAX) === 1) {
            val = ZOOM_MAX;
        } else if (val.compare(ZOOM_MIN) === -1) {
            val = ZOOM_MIN;
        }

        if (!this.data.zoom.equals(val)) {
            this.data.zoom = val;
        }
    }

    /**
     * Converts the time to a position relative to the notefield canvas origin.
     * This is unaffected by things like scroll, scroll direction, receptorY, etc.
     */
    timeToNotefieldPosition(time: number): number {
        return time * this.pixelsPerSecond;
    }

    /**
     * Converts the time to a position relative to the top of the notefield element
     * in the DOM.
     */
    timeToScreenPosition(time: number): number {
        const { receptorY, scrollDirection } = this.root.notefieldDisplay.data;
        let pos = (time - this.data.scroll.time.value) * this.pixelsPerSecond;

        if (scrollDirection === "down") {
            pos = this.data.height - pos;
            pos -= receptorY;
        } else {
            pos += receptorY;
        }

        return pos;
    }

    /**
     * Updates the canvas width.
     */
    updateWidth() {
        assert(this.canvas, "canvas must be set before calling updateWidth");

        const width = this.root.notefieldDisplay.data.columnWidth * this.data.chart.keyCount.value;

        // Only update if the width is different. Setting the canvas width ALWAYS causes
        // the canvas to be cleared.
        if (this.canvas.width === width) {
            return;
        }

        this.canvas.width = width;
        this.data.width = this.canvas.width;
    }
}

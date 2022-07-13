import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting";
import { BeatSnap } from "../notefield/beatsnap";
import { NotefieldContext } from "../notefield/context";
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

    /**
     * A 2D array for tracking which notes are selected.
     *
     * The first dimension of the array is the chart key. The second dimension is a list
     * of indexes of selected notes.
     *
     * A note's index is the number of notes that come before it for that key. If a note
     * is the first one for that key, its index is 0. The next note for that key is 1,
     * then 2, etc.
     *
     * These indexes will potentially become invalid if you add or remove notes from the
     * chart. For that reason, if any notes are added or removed, the selection is reset.
     */
    selectedNotes: number[][];
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

    // The context and draw data are not included inside `data` to avoid recursion.
    // The Notefield component watches `data` for changes to know when to redraw the
    // notefield. It redraws by updating the context and draw data here. If these
    // are included in `data`, then a redraw is considered a change, which triggers
    // a redraw, etc.
    ctx?: NotefieldContext;
    drawData?: NotefieldDrawData;

    canvas?: HTMLCanvasElement;

    readonly autoScroller: AutoScrollController;

    constructor(root: RootStore) {
        makeAutoObservable(this, {
            autoScroller: false,
            canvas: observable.ref,
            ctx: observable.ref,
            drawData: observable.ref,
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

            selectedNotes: [],
        };
    }

    /**
     * Returns the pixels per second, taking into account the scaling.
     */
    get pixelsPerSecond(): number {
        return this.root.notefieldDisplay.data.pixelsPerSecond * this.data.zoom.valueOf();
    }

    /**
     * Clears any selected notes on the notefield.
     */
    clearSelectedNotes() {
        assert(this.data.chart, "chart must be set");

        this.data.selectedNotes = [];

        for (let i = 0; i < this.data.chart.keyCount.value; i++) {
            this.data.selectedNotes.push([]);
        }
    }

    /**
     * Unselects a single note by its index. Does nothing if the note wasn't selected.
     *
     * Returns true if the note was deselected.
     */
    unselectNote(key: number, index: number): boolean {
        const notes = this.data.selectedNotes[key];
        const i = notes.indexOf(index);

        if (i !== -1) {
            notes.splice(i, 1);
            return true;
        }

        return false;
    }

    /**
     * Selects a single note by its index. Does nothing if the note was already selected.
     *
     * Returns true if the note was selected.
     */
    selectNote(key: number, index: number): boolean {
        const notes = this.data.selectedNotes[key];

        if (notes.indexOf(index) === -1) {
            notes.push(index);
            notes.sort();
            return true;
        }

        return false;
    }

    /**
     * Toggles a note between being selected and unselected.
     */
    toggleSelectNote(key: number, index: number) {
        this.unselectNote(key, index) || this.selectNote(key, index);
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
        this.clearSelectedNotes();
        this.resetView();
    }

    setContext(ctx: NotefieldContext) {
        this.ctx = ctx;
    }

    setDrawData(drawData: NotefieldDrawData) {
        this.drawData = drawData;
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

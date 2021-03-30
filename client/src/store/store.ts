import assert from "assert";
import Fraction from "fraction.js";
import { makeAutoObservable, observable } from "mobx";

import { Beat, BeatTime, Chart, Time } from "../charting/";
import { NoteFieldConfig, NoteFieldState, ScrollDirection } from "../notefield/config";

import { AutoScroll } from "./autoScroll";
import { UserConfigStorage } from "./userConfig";

/**
 * The store for the application.
 */
export class Store {
    config: NoteFieldConfig;
    state: NoteFieldState;
    el?: HTMLCanvasElement;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        makeAutoObservable(this, {
            el: false,
            minZoom: false,
            maxZoom: false,
        });
        this.config = config;
        this.state = makeAutoObservable(state, {
            zoom: observable.ref,
        });
    }

    /**
     * Resets the scroll and zoom to the default.
     */
    resetView() {
        this.setScroll({ time: Time.Zero });
        this.setZoom(new Fraction(1));
    }

    /**
     * Sets the canvas element that's being used to draw the notefield.
     */
    setCanvas(el: HTMLCanvasElement) {
        this.el = el;
        this.el.width = this.state.width;
    }

    /**
     * Sets the chart being rendered by the notefield.
     */
    setChart(chart: Chart) {
        this.config.chart = chart;
        this.resetView();
    }

    /**
     * Updates the render height of the notefield.
     */
    setHeight(height: number) {
        // Only update the height if we need to. Using the `el.height` setter will cause
        // the notefield to be cleared, even if the value didn't change.
        if (height !== this.state.height) {
            if (this.el) {
                this.el.height = height;
            }

            this.state.height = height;
        }
    }

    setMetronome(enabled: boolean) {
        this.state.playMetronome = enabled;
    }

    setPlaying(isPlaying: boolean) {
        if (isPlaying !== this.state.isPlaying) {
            this.state.isPlaying = isPlaying;

            if (isPlaying) {
                new AutoScroll(this).start();
            }
        }
    }

    /**
     * Sets the scroll position to a specific beat/time.
     */
    setScroll({ beat, time }: Partial<BeatTime>) {
        if (beat !== undefined) {
            time = this.config.chart.bpms.timeAt(beat);
            this.state.scroll = { beat, time };
        } else if (time !== undefined) {
            beat = this.config.chart.bpms.beatAt(time);
            this.state.scroll = { beat, time };
        } else {
            throw Error("beat or time must be set");
        }
    }

    /**
     * Sets the scroll direction of the notefield.
     */
    setScrollDirection(direction: ScrollDirection) {
        if (direction !== this.config.scrollDirection) {
            this.config.scrollDirection = direction;
            UserConfigStorage.update({ scrollDirection: direction });
        }
    }

    // Equivalent to clicking the zoom in/out button 8 times.
    readonly minZoom = new Fraction(256, 6561);
    readonly maxZoom = new Fraction(6561, 256);

    /**
     * Sets the notefield zoom.
     */
    setZoom(to: Fraction) {
        assert(to.compare(0) === 1, "zoom must be greater than zero");

        let zoom = to;

        if (zoom.compare(this.maxZoom) === 1) {
            zoom = this.maxZoom;
        } else if (zoom.compare(this.minZoom) === -1) {
            zoom = this.minZoom;
        }

        if (!this.state.zoom.equals(zoom)) {
            this.state.zoom = zoom;
        }
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
}

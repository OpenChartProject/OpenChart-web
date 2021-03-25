import Fraction from "fraction.js";

import { makeAutoObservable, observable } from "mobx";
import { Beat, BeatTime } from "../charting/beat";
import { Time } from "../charting/time";
import { NoteFieldConfig, NoteFieldState } from "../notefield/config";

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
        });
        this.config = config;
        this.state = makeAutoObservable(state, {
            scaleY: observable.ref,
        });
    }

    /**
     * Sets the canvas element that's being used to draw the notefield.
     */
    setCanvas(el: HTMLCanvasElement) {
        this.el = el;
        this.el.width = this.state.width;
    }

    /**
     * Updates the render height of the notefield.
     */
    setHeight(height: number) {
        if (height !== this.state.height) {
            if (this.el) {
                this.el.height = height;
            }

            this.state.height = height;
        }
    }

    /**
     * Sets the Y scale of the notefield.
     */
    setScaleY(to: Fraction) {
        this.state.scaleY = to;
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
     * Scrolls the notefield relative to its current position, based on the
     * provided beat/time deltas.
     */
    scrollBy({ beat, time }: { beat?: number; time?: number }) {
        if (beat !== undefined) {
            this.setScroll({
                beat: new Beat(
                    Math.max(beat + this.state.scroll.beat.value, 0),
                ),
            });
        } else if (time !== undefined) {
            this.setScroll({
                time: new Time(
                    Math.max(time + this.state.scroll.time.value, 0),
                ),
            });
        } else {
            throw Error("beat or time must be set");
        }
    }
}

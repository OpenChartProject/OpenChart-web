import Fraction from "fraction.js";
import { makeAutoObservable } from "mobx";
import { Beat, BeatTime } from "../charting/beat";
import { Time } from "../charting/time";

import { NoteFieldConfig, NoteFieldState } from "../notefield/config";

/**
 * The store for the application.
 */
export class RootStore {
    config: NoteFieldConfig;
    state: NoteFieldState;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        makeAutoObservable(this);
        this.config = config;
        this.state = state;
    }

    /**
     * Updates the render dimensions of the notefield.
     */
    setDimensions({ width, height }: { width?: number; height?: number }) {
        this.state.width = width ?? this.state.width;
        this.state.height = height ?? this.state.height;
    }

    setScale(to: Fraction) {
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

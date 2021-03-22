import { makeAutoObservable } from "mobx";
import { Beat, BeatTime } from "../charting/beat";
import { Time } from "../charting/time";

import { NoteFieldConfig, NoteFieldState } from "../notefield/config";

export class RootStore {
    config: NoteFieldConfig;
    state: NoteFieldState;

    constructor(config: NoteFieldConfig, state: NoteFieldState) {
        this.config = config;
        this.state = state;
        makeAutoObservable(this);
    }

    setDimensions({ width, height }: { width?: number; height?: number }) {
        this.state.width = width ?? this.state.width;
        this.state.height = height ?? this.state.height;
    }

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

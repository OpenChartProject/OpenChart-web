import { BeatTime } from "../charting/beat";
import { Chart } from "../charting/chart";
import { NoteSkin } from "../noteskin";
import { KeyBinds } from "./input";


/**
 * The different baseline options for how the notefield is displayed. This affects
 * how objects are aligned relative to the beat lines.
 */
export enum Baseline {
    Before,
    Centered,
    After,
}

export interface NoteFieldConfig {
    beatLines: {
        measureLines: {
            color: string;
            lineWidth: number;
        };

        nonMeasureLines: {
            color: string;
            lineWidth: number;
        };
    };

    colors: {
        background: string;
    };

    keyBinds: KeyBinds;
    baseline: Baseline;
    chart: Chart;
    columnWidth: number;
    keyCount: number;
    noteSkin: NoteSkin;
    pixelsPerSecond: number;
    secondsPerScrollTick: number;
    margin: number;
}

export interface NoteFieldState {
    width: number;
    height: number;
    scroll: BeatTime;
}

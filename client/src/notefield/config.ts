import { BeatTime } from "../charting/beat";
import { Chart } from "../charting/chart";
import { NoteSkin } from "../noteskin";
import { BeatSnap } from "./beatsnap";
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

/**
 * The various options that control how the notefield should look and feel.
 */
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
    margin: number;
}

/**
 * The state of the notefield, usually manipulated by the user doing something.
 *
 * There isn't much difference between this and NoteFieldConfig. The state is separate
 * just to organize "stuff that probably won't change" and "stuff that will change".
 */
export interface NoteFieldState {
    snap: BeatSnap;
    width: number;
    height: number;
    scroll: BeatTime;
}

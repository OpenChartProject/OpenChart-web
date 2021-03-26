import Fraction from "fraction.js";
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

export type ScrollDirection = "up" | "down";

/**
 * The various options that control how the notefield should look and feel.
 */
export interface NoteFieldConfig {
    beatLines: {
        measureLines: {
            color: string;
            lineWidth: number;
        };

        wholeBeatLines: {
            color: string;
            lineWidth: number;
        };

        fractionalLines: {
            color: string;
            lineWidth: number;
        };
    };

    colors: {
        background: string;
    };

    baseline: Baseline;
    chart: Chart;
    columnWidth: number;
    keyBinds: KeyBinds;
    keyCount: number;
    margin: number;
    noteSkin: NoteSkin;
    pixelsPerSecond: number;
    scrollDirection: ScrollDirection;
}

/**
 * The state of the notefield, usually manipulated by the user doing something.
 *
 * There isn't much difference between this and NoteFieldConfig. The state is separate
 * just to organize "stuff that probably won't change" and "stuff that will change".
 */
export interface NoteFieldState {
    width: number;
    height: number;

    zoom: Fraction;
    scroll: BeatTime;
    snap: BeatSnap;
}

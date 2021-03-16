import { Chart } from "../charting/chart";
import { NoteSkin } from "../noteskin";

export interface NoteFieldConfig {
    colors: {
        background: string;
        beatLines: string;
    };

    chart: Chart;
    columnWidth: number;
    keyCount: number;
    noteSkin: NoteSkin;
    pixelsPerSecond: number;
    secondsPerScrollTick: number;
}

export interface NoteFieldState {
    width: number;
    height: number;
    scroll: number;
}

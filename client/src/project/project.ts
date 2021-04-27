import { Chart } from "../charting";

export interface SongData {
    artist: string;
    title: string;
    audioOffset: number;
}

export interface Project {
    charts: Chart[];
    song: SongData;
}

import { Chart } from "../charting";

export interface SongData {
    artist: string;
    title: string;
}

export interface Project {
    charts: Chart[];
    song: SongData;
}

import { Chart } from "../charting/chart";

export interface SongData {
    artist: string;
    title: string;
}

export interface Project {
    charts: Chart[];
    song: SongData;
}

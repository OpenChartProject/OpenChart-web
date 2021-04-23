import { BPM } from "./types";

export interface DisplayBPM {
    min?: number;
    max?: number;
    random: boolean;
}

export interface FilePaths {
    banner: string;
    background: string;
    cdTitle: string;
}

export interface SongData {
    artist: string;
    title: string;
    subtitle: string;

    bpms: BPM[];
    displayBPM?: DisplayBPM;
    offset: number;
    previewStart: number;
    previewLength: number;
}

export interface Chart {
    type: string;
    name: string;
    difficulty: string;
    rating: number;
    measures: string[];
}

export interface FileData {
    charts: Chart[];
    files: FilePaths;
    song: SongData;
}

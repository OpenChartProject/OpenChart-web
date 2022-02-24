import { BPM, Chart } from "./types";

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
    audioOffset: number;
    previewStart: number;
    previewLength: number;
}

export interface FileData {
    charts: Chart[];
    files: FilePaths;
    song: SongData;
}

/**
 * Returns a FileData object with defaults
 */
export const newFileData = (): FileData => {
    return {
        charts: [],
        files: {
            background: "",
            banner: "",
            cdTitle: "",
        },
        song: {
            artist: "",
            bpms: [],
            audioOffset: 0,
            previewLength: 0,
            previewStart: 0,
            subtitle: "",
            title: "",
        },
    };
};

export interface BPM {
    beat: number;
    value: number;
}

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

export interface FileData {
    files: FilePaths;
    song: SongData;
}

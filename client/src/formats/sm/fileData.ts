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
    bpm: DisplayBPM;
    title: string;
    subtitle: string;
    artist: string;
    previewStart: number;
    previewLength: number;
}

export interface FileData {
    files: FilePaths;
    song: SongData;
}

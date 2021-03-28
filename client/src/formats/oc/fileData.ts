import { SongData } from "../../project";

import { Chart } from "./types/";

export interface FileData {
    metaData: {
        version: string;
    };

    charts: Chart[];
    song: SongData;
}

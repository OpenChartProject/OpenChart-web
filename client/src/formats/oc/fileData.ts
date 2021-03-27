import { Chart } from "../../charting/chart";
import { SongData } from "../../project/project";

export interface FileData {
    charts: Chart[];
    metaData: {
        version: string;
    };
    song: SongData;
}

import { Chart } from "../../charting/chart";

export interface MetaData {
    version: number;
}

export interface FileData {
    charts: Chart[];
    metaData: MetaData;
}

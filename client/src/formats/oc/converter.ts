import { Project } from "../../project";
import { IConverter } from "../converter";

import { FileData } from "./fileData";
import { ChartConverter } from "./types";

export class Converter implements IConverter<FileData> {
    fromNative(project: Project): FileData {
        return {
            charts: project.charts.map((c) => {
                return new ChartConverter().fromNative(c);
            }),
            metaData: {
                version: "0.1",
            },
            song: project.song,
        };
    }

    toNative(data: FileData): Project {
        return {
            charts: data.charts.map((c) => {
                return new ChartConverter().toNative(c);
            }),
            song: data.song,
        };
    }
}

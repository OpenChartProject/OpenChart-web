import { Project } from "../../project/";
import { IConverter } from "../converter";

import { FileData } from "./fileData";

export class Converter implements IConverter<FileData> {
    fromNative(project: Project): FileData {
        return {
            charts: project.charts,
            metaData: {
                version: "0.1",
            },
            song: project.song,
        };
    }

    toNative(data: FileData): Project {
        return {
            charts: data.charts,
            song: data.song,
        };
    }
}

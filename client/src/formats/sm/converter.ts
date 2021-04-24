import { Project } from "../../project";
import { IConverter } from "../converter";

import { FileData, newFileData } from "./fileData";

export class Converter implements IConverter<FileData> {
    fromNative(project: Project): FileData {
        const data = newFileData();

        data.song.artist = project.song.artist;
        data.song.title = project.song.title;

        return data;
    }

    toNative(data: FileData): Project {
        const p: Project = {
            charts: [],
            song: {
                artist: data.song.artist,
                title: data.song.title,
            },
        };

        return p;
    }
}

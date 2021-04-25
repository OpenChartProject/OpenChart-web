import { Project } from "../../project";
import { IConverter } from "../converter";

import { FileData, newFileData } from "./fileData";
import { BPMConverter, ChartConverter } from "./types";

export class Converter implements IConverter<FileData> {
    fromNative(project: Project): FileData {
        const data = newFileData();

        data.song.artist = project.song.artist;
        data.song.title = project.song.title;

        if (project.charts.length) {
            data.song.bpms = project.charts[0].bpms
                .getAll()
                .map((bt) => new BPMConverter().fromNative(bt.bpm));
            data.charts = project.charts.map((c) => new ChartConverter().fromNative(c));
        }

        return data;
    }

    toNative(data: FileData): Project {
        const p: Project = {
            charts: data.charts.map((c) => new ChartConverter(data.song.bpms).toNative(c)),
            song: {
                artist: data.song.artist,
                title: data.song.title,
            },
        };

        return p;
    }
}

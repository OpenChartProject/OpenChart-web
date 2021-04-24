import _ from "lodash";

import { ISerializer } from "../serializer";

import { readFields } from "./fieldReader";
import { Fields } from "./fields";
import { Chart, FileData, newFileData } from "./fileData";
import { BPM } from "./types";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        const data: FileData = newFileData();

        for (const field of readFields(contents)) {
            const { name, value } = field;

            switch (name) {
                case Fields.artist:
                    data.song.artist = value;
                    break;

                case Fields.background:
                    data.files.background = value;
                    break;

                case Fields.banner:
                    data.files.banner = value;
                    break;

                case Fields.cdTitle:
                    data.files.cdTitle = value;
                    break;

                case Fields.subtitle:
                    data.song.subtitle = value;
                    break;

                case Fields.title:
                    data.song.title = value;
                    break;

                case Fields.offset:
                    data.song.offset = _.toNumber(value);
                    break;

                case Fields.sampleLength:
                    data.song.previewLength = _.toNumber(value);
                    break;

                case Fields.sampleStart:
                    data.song.previewStart = _.toNumber(value);
                    break;

                case Fields.bpms:
                    data.song.bpms = this.parseBPMs(value);
                    break;

                case Fields.notes:
                    data.charts.push(this.parseChart(value));
                    break;

                default:
                // skip
            }
        }

        return data;
    }

    write(data: FileData): string {
        throw Error;
    }

    /**
     * Parses the contents of the BPMS field and returns a list of BPM changes.
     *
     * BPMs are formatted as: beat=value,beat=value,...
     */
    private parseBPMs(contents: string): BPM[] {
        const bpms: BPM[] = [];

        for (const change of contents.split(",")) {
            const [beat, value] = change.split("=");

            bpms.push({ beat: _.toNumber(beat), val: _.toNumber(value) });
        }

        return bpms;
    }

    /**
     * Parses the contents of the NOTES field. A file can have mutliple NOTES fields.
     *
     * The NOTES field is formatted as:
     *  chart-type : name : chart-difficulty : chart-rating : radar-values : measures
     *
     * The radar values are a legacy feature from early versions of SM so we can ignore them.
     *
     * The measures are comma separated.
     */
    private parseChart(contents: string): Chart {
        const parts = contents.split(":");
        const chart: Chart = {
            type: parts[0].trim(),
            name: parts[1].trim(),
            difficulty: parts[2].trim(),
            rating: _.toNumber(parts[3].trim()),
            measures: [],
        };

        for (const measure of parts[5].split(",")) {
            // Remove all whitespace
            chart.measures.push(measure.replace(/\s+/g, ""));
        }

        return chart;
    }
}

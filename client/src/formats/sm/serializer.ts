import _ from "lodash";

import { ISerializer } from "../serializer";

import { readFields } from "./fieldReader";
import { Fields } from "./fields";
import { FileData } from "./fileData";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        const data: FileData = {
            files: {
                background: "",
                banner: "",
                cdTitle: "",
            },
            song: {
                artist: "",
                bpms: [],
                offset: 0,
                previewLength: 0,
                previewStart: 0,
                subtitle: "",
                title: "",
            },
        };

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

                default:
                // skip
            }
        }

        return data;
    }

    write(data: FileData): string {
        throw Error;
    }
}

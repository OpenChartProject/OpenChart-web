import { IConverter } from "./converter";
import { ISerializer } from "./serializer";

import { OCZSerializer } from "./ocz";
import { OCConverter, OCSerializer } from "./oc";
import { SMConverter, SMSerializer } from "./sm";
import { Project } from "../project";

export interface FormatInfo {
    name: string;
    ext: string;
    converter: IConverter<any>;
    serializer: ISerializer<any>;
}

export type formatList = { [ext: string]: FormatInfo };

export const Formats: formatList = {
    ".sm": {
        name: "StepMania/Etterna",
        ext: ".sm",
        converter: new SMConverter(),
        serializer: new SMSerializer(),
    },

    ".oc": {
        name: "OpenChart",
        ext: ".oc",
        converter: new OCConverter(),
        serializer: new OCSerializer(),
    },

    ".ocz": {
        name: "OpenChart (compressed)",
        ext: ".ocz",
        converter: new OCConverter(),
        serializer: new OCZSerializer(),
    },
}

export function getFormatFromFileName(name: string): FormatInfo | null {
    name = name.toLowerCase();

    for (const ext in Formats) {
        if (name.endsWith(ext)) {
            return Formats[ext];
        }
    }

    return null;
}

export function loadFromString(format: FormatInfo, data: string): Project {
    const fd = format.serializer.read(data);
    const project = format.converter.toNative(fd);

    return project;
}

export function writeToString(format: FormatInfo, project: Project): string {
    const fd = format.converter.fromNative(project);
    const data = format.serializer.write(fd);

    return data;
}

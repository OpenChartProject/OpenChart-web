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

/**
 * A mapping of the supported chart formats.
 */
export const Formats: Readonly<formatList> = {
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

/**
 * Returns the format that matches the extension of the filename.
 */
export function getFormatFromFileName(name: string): FormatInfo | null {
    name = name.toLowerCase();

    for (const ext in Formats) {
        if (name.endsWith(ext)) {
            return Formats[ext];
        }
    }

    return null;
}

/**
 * Loads in the raw file format data and converts it to a Project.
 */
export function loadFromString(format: FormatInfo, data: string): Project {
    const fd = format.serializer.read(data);
    const project = format.converter.toNative(fd);

    return project;
}

/**
 * Converts the project into the given format and returns the contents of the file.
 */
export function writeToString(format: FormatInfo, project: Project): string {
    const fd = format.converter.fromNative(project);
    const data = format.serializer.write(fd);

    return data;
}

import { ISerializer } from "../serializer";

import { FileData } from "./fileData";

/**
 * Serializer for reading and writing .oc project files.
 */
export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        return JSON.parse(contents);
    }

    write(data: FileData): string {
        return JSON.stringify(data);
    }
}

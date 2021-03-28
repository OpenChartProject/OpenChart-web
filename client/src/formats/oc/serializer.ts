import { ISerializer } from "../serializer";

import { FileData } from "./fileData";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        return JSON.parse(contents);
    }

    write(data: FileData): string {
        return JSON.stringify(data);
    }
}

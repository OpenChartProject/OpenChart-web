import { ISerializer } from "../serializer";

import { FileData } from "./fileData";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        throw Error;
    }

    write(data: FileData): string {
        throw Error;
    }
}

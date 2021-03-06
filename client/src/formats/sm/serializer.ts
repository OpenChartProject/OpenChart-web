import { FileData } from "./fileData";
import { ISerializer } from "../serializer";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        throw Error;
    }

    write(data: FileData): string {
        throw Error;
    }
}

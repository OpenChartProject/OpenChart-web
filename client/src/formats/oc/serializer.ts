import { FileData } from "./fileData";
import { ISerializer } from "../serializer";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        return JSON.parse(contents);
    }

    write(data: FileData): string {
        return JSON.stringify(data);
    }
}

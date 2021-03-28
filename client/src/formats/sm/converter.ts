import { Project } from "../../project/project";
import { IConverter } from "../converter";

import { FileData } from "./fileData";

export class Converter implements IConverter<FileData> {
    fromNative(project: Project): FileData {
        throw new Error("Method not implemented.");
    }

    toNative(data: FileData): Project {
        throw new Error("Method not implemented.");
    }
}

import { fromByteArray, toByteArray } from "base64-js";
import { deflate, inflate } from "pako";

import { ISerializer } from "../serializer";

import { FileData } from "../oc/fileData";
import { OCSerializer } from "../oc";

export class Serializer implements ISerializer<FileData> {
    read(contents: string): FileData {
        const decompressed = inflate(toByteArray(contents), { to: "string" });
        return new OCSerializer().read(decompressed);
    }

    write(data: FileData): string {
        const json = new OCSerializer().write(data);
        return fromByteArray(deflate(json));
    }
}

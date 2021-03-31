import { fromByteArray, toByteArray } from "base64-js";
import { deflate, inflate } from "pako";

import { OCSerializer } from "../oc";
import { FileData } from "../oc/fileData";
import { ISerializer } from "../serializer";

/**
 * Serializer for reading and writing compressed .ocz files.
 *
 * .ocz files are compressed using the DEFLATE algorithm and then encoded in base64 so
 * we don't need to worry about reading/writing binary. Even with the extra space needed
 * for the base64 encoding, the compressed size is still much smaller.
 */
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

import { KeyObjects } from "../../../charting/chart";
import { TypeConverter } from "../../converter";

export type Measure = string;
export type NoteData = Measure[];

/**
 * Converts the SM note data into note data usable by the editor.
 *
 * The major difference between the SM note data and the editor note data is that
 * the SM note data is organized into rows where each row is a specific beat,
 * whereas the editor organizes the note data into columns.
 */
export class NoteDataConverter implements TypeConverter<KeyObjects[], NoteData> {
    private readonly keyCount: number;

    constructor(keyCount?: number) {
        this.keyCount = keyCount ?? 4;
    }

    toNative(data: NoteData): KeyObjects[] {
        const keys: KeyObjects[] = [];

        for (let i = 0; i < this.keyCount; i++) {
            keys.push([]);
        }

        for (const measure of data) {
            if (!measure) {
                continue;
            }
        }

        return keys;
    }

    fromNative(data: KeyObjects[]): NoteData {
        throw new Error("Method not implemented.");
    }
}

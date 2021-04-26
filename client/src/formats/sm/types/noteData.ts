import Fraction from "fraction.js";
import { Beat } from "../../../charting";
import { KeyObjects } from "../../../charting/chart";
import { Tap } from "../../../charting/objects";
import { TypeConverter } from "../../converter";

export type Measure = string;
export type NoteData = Measure[];

export enum NoteType {
    empty = "0",
    tap = "1",
    holdHead = "2",
    holdRollTail = "3",
    rollHead = "4",
    mine = "M",
    keySound = "K",
    lift = "L",
    fake = "F",
}

/**
 * Converts the SM note data into note data usable by the editor.
 *
 * The major difference between the SM note data and the editor note data is that
 * the SM note data is organized into rows where each row is a specific beat,
 * whereas the editor organizes the note data into columns.
 */
export class NoteDataConverter implements TypeConverter<KeyObjects[], NoteData> {
    private holds!: (number | null)[];
    private keys!: KeyObjects[];
    private readonly keyCount: number;

    constructor(keyCount?: number) {
        this.keyCount = keyCount ?? 4;
    }

    toNative(data: NoteData): KeyObjects[] {
        this.holds = [];
        this.keys = [];

        for (let i = 0; i < this.keyCount; i++) {
            this.holds.push(null);
            this.keys.push([]);
        }

        let measureBeat = -1;

        for (const measure of data) {
            measureBeat++;

            if (!measure) {
                continue;
            }

            this.convertMeasureToNative(measure, measureBeat);
        }

        return this.keys;
    }

    fromNative(data: KeyObjects[]): NoteData {
        throw new Error("Method not implemented.");
    }

    private convertMeasureToNative(measure: Measure, measureBeat: number) {
        const rows = measure.length / this.keyCount;
        let beat = new Fraction(measureBeat);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < this.keyCount; j++) {
                const ch = measure[i * this.keyCount + j];

                switch (ch as NoteType) {
                    case NoteType.tap:
                        this.keys[j].push(new Tap(new Beat(beat), j));
                        break;

                    default:
                    // skip
                }
            }

            beat = beat.add(1, rows);
        }
    }
}

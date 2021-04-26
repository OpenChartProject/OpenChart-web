import assert from "assert";
import Fraction from "fraction.js";

import { Beat } from "../../../charting";
import { KeyObjects } from "../../../charting/chart";
import { Hold, Tap } from "../../../charting/objects";
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
    private holds!: (Fraction | null)[];
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
        assert(rows === Math.floor(rows), "note data is not evenly divisible by key count");

        let beat = new Fraction(measureBeat);

        for (let i = 0; i < rows; i++) {
            for (let key = 0; key < this.keyCount; key++) {
                const ch = measure[i * this.keyCount + key];

                switch (ch as NoteType) {
                    case NoteType.tap:
                        if (this.holds[key] === null) {
                            this.keys[key].push(new Tap(new Beat(beat), key));
                        }

                        break;

                    case NoteType.holdHead:
                    case NoteType.rollHead:
                        this.holds[key] = beat;
                        break;

                    case NoteType.holdRollTail:
                        if (this.holds[key] !== null) {
                            const start = new Beat(this.holds[key] as Fraction);
                            const duration = new Beat(beat.sub(start.fraction));

                            this.keys[key].push(new Hold(start, duration, key));
                            this.holds[key] = null;
                        }

                        break;

                    default:
                    // skip
                }
            }

            beat = beat.add(1, rows);
        }
    }
}

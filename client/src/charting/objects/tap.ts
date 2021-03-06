import { Beat } from "../beat";
import { KeyIndex } from "../keyIndex";
import { ChartObject } from "./chartObject";

export class Tap implements ChartObject {
    beat: Beat;
    key: KeyIndex;

    constructor(beat: Beat, key: KeyIndex) {
        this.beat = beat;
        this.key = key;
    }
}

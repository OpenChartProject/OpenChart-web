import { Beat } from "../beat";
import { KeyIndex } from "../keyIndex";
import { toBeat, toKeyIndex } from "../util";

import { ChartObject } from "./chartObject";

export class Tap implements ChartObject {
    beat: Beat;
    key: KeyIndex;
    readonly type = "tap";

    constructor(beat: Beat | number, key: KeyIndex | number) {
        this.beat = toBeat(beat);
        this.key = toKeyIndex(key);
    }
}

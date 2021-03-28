import { Beat } from "../beat";
import { KeyIndex } from "../keyIndex";
import { toBeat, toKeyIndex } from "../util";

import { ChartObject } from "./chartObject";

export class Hold implements ChartObject {
    beat: Beat;
    duration: Beat;
    key: KeyIndex;
    readonly type = "hold";

    constructor(beat: Beat | number, duration: Beat | number, key: KeyIndex | number) {
        this.beat = toBeat(beat);
        this.duration = toBeat(duration);
        this.key = toKeyIndex(key);
    }
}

import assert from "assert";
import { BeatTime } from "../charting/";

import { Chart } from "../charting/";
import { Time } from "../charting/";
import { toTime } from "../charting/";
import { BeatSnap } from "./beatsnap";

/**
 * Returns a list of BeatTimes where beat lines would occur in a chart, given
 * an interval of time.
 */
export function getBeatLineTimes(
    chart: Chart,
    snap: BeatSnap,
    start: Time | number,
    end: Time | number,
): BeatTime[] {
    start = toTime(start);
    end = toTime(end);

    assert(start.value <= end.value, "start cannot come after end");

    const result: BeatTime[] = [];
    let beat = chart.bpms.beatAt(start);

    if (!beat.isWholeBeat()) {
        beat = snap.nextBeat(beat);
    }

    while (true) {
        const time = chart.bpms.timeAt(beat);

        if (time.value > end.value) {
            break;
        }

        result.push({ beat, time });
        beat = snap.nextBeat(beat);
    }

    return result;
}

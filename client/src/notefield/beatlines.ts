import assert from "assert";
import { BeatTime } from "../charting/beat";

import { Chart } from "../charting/chart";
import { Time } from "../charting/time";
import { toTime } from "../charting/util";

export function getBeatLineTimes(
    chart: Chart,
    start: Time | number,
    end: Time | number,
): BeatTime[] {
    start = toTime(start);
    end = toTime(end);

    assert(start.value < end.value, "start must be less than end");

    const result: BeatTime[] = [];
    let beat = chart.bpms.beatAt(start);

    if (!beat.isWholeBeat()) {
        beat = beat.next();
    }

    while (true) {
        const time = chart.bpms.timeAt(beat);

        if (time.value > end.value) {
            break;
        }

        result.push({ beat, time });
        beat = beat.next();
    }

    return result;
}

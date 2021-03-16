import assert from "assert";

import { Chart } from "../charting/chart";
import { Time } from "../charting/time";

export function getBeatLineTimes(chart: Chart, start: Time, end: Time): Time[] {
    assert(start.value < end.value, "start must be less than end");

    const times: Time[] = [];
    let beat = chart.bpms.beatAt(start);

    if (!beat.isWholeBeat) {
        beat = beat.next();
    }

    while (true) {
        const time = chart.bpms.timeAt(beat);

        if (time.value > end.value) {
            break;
        }

        times.push(time);
        beat = beat.next();
    }

    return times;
}

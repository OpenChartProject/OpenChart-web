import assert from "assert";
import { Beat, BeatTime } from "../charting/beat";
import { BPM } from "../charting/bpm";
import { BPMList } from "../charting/bpmList";
import { Chart } from "../charting/chart";
import { Time } from "../charting/time";
import { getBeatLineTimes } from "./beatlines";

let c: Chart;

function bt(beat: number, time: number): BeatTime {
    return { beat: new Beat(beat), time: new Time(time) };
}

beforeEach(() => {
    // Uses a default BPM of 120.
    c = new Chart();
});

describe("beatlines", () => {
    describe("#getBeatLineTimes", () => {
        it("throws if start is not less than end", () => {
            assert.throws(() => getBeatLineTimes(c, Time.Zero, Time.Zero));
            assert.throws(() => getBeatLineTimes(c, new Time(1), Time.Zero));
        });

        it("includes start and end if they are whole beats", () => {
            const actual = getBeatLineTimes(c, Time.Zero, new Time(1));
            assert.deepStrictEqual(actual, [bt(0, 0), bt(1, 0.5), bt(2, 1)]);
        });

        it("handles BPM changes", () => {
            const bpms = new BPMList([
                new BPM(new Beat(0), 60),
                new BPM(new Beat(2), 120),
            ]);
            c = new Chart(bpms);
            const actual = getBeatLineTimes(c, Time.Zero, new Time(3));
            assert.deepStrictEqual(actual, [
                bt(0, 0),
                bt(1, 1),
                bt(2, 2),
                bt(3, 2.5),
                bt(4, 3),
            ]);
        });
    });
});

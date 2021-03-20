import assert from "assert";
import { BPM } from "../charting/bpm";
import { BPMList } from "../charting/bpmList";
import { Chart } from "../charting/chart";
import { toBeatTime } from "../charting/util";
import { getBeatLineTimes } from "./beatlines";

let c: Chart;

beforeEach(() => {
    // Uses a default BPM of 120.
    c = new Chart();
});

describe("beatlines", () => {
    describe("#getBeatLineTimes", () => {
        it("throws if start is not less than end", () => {
            assert.throws(() => getBeatLineTimes(c, 0, 0));
            assert.throws(() => getBeatLineTimes(c, 1, 0));
        });

        it("includes start and end if they are whole beats", () => {
            const actual = getBeatLineTimes(c, 0, 1);
            assert.deepStrictEqual(actual, [
                toBeatTime(0, 0),
                toBeatTime(1, 0.5),
                toBeatTime(2, 1),
            ]);
        });

        it("handles BPM changes", () => {
            const bpms = new BPMList([new BPM(0, 60), new BPM(2, 120)]);
            c = new Chart(bpms);
            const actual = getBeatLineTimes(c, 0, 3);
            assert.deepStrictEqual(actual, [
                toBeatTime(0, 0),
                toBeatTime(1, 1),
                toBeatTime(2, 2),
                toBeatTime(3, 2.5),
                toBeatTime(4, 3),
            ]);
        });
    });
});

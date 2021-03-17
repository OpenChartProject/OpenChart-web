import assert from "assert";
import { Beat } from "../charting/beat";
import { BPM } from "../charting/bpm";
import { BPMList } from "../charting/bpmList";
import { Chart } from "../charting/chart";
import { Time } from "../charting/time";
import { getBeatLineTimes } from "./beatlines";

let c: Chart;

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
            assert.deepStrictEqual(
                getBeatLineTimes(c, Time.Zero, new Time(1)),
                [Time.Zero, new Time(0.5)]
            );
        });

        it("handles BPM changes", () => {
            const bpms = new BPMList([
                new BPM(new Beat(0), 60),
                new BPM(new Beat(2), 120),
            ]);
            c = new Chart(bpms);

            assert.strictEqual(getBeatLineTimes(c, Time.Zero, new Time(3)), [
                Time.Zero,
                new Time(1),
                new Time(2),
                new Time(2.5),
            ]);
        });
    });
});

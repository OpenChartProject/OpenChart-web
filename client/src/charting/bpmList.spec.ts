import assert from "assert";
import { Beat } from "./beat";
import { BPM } from "./bpm";
import { BPMList } from "./bpmList";
import { Time } from "./time";

describe("BPMList", () => {
    describe("#setBPMS", () => {
        it("throws if list is empty", () => {
            assert.throws(() => new BPMList([]));
        });

        it("throws if the first BPM is not at beat 0", () => {
            assert.throws(() => new BPMList([new BPM(new Beat(1), 120)]));
        });

        it("calculates the time of each bpm", () => {
            const lst = new BPMList([
                new BPM(Beat.Zero, 120),
                new BPM(new Beat(4), 60),
            ]);

            assert.strictEqual(lst.getBPMS()[0].time.value, 0);
            assert.strictEqual(lst.getBPMS()[1].time.value, 2);
        });
    });

    describe("#beatAt", () => {
        it("returns 0 if time is 0", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert.strictEqual(lst.beatAt(Time.Zero).value, 0);
        });

        it("works with one BPM change", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert.strictEqual(lst.beatAt(Time.Zero).value, 0);
            assert.strictEqual(lst.beatAt(new Time(1)).value, 2);
            assert.strictEqual(lst.beatAt(new Time(2)).value, 4);
        });

        it("works with two BPM changes", () => {
            const lst = new BPMList([
                new BPM(Beat.Zero, 120),
                new BPM(new Beat(4), 60),
            ]);

            assert.strictEqual(lst.beatAt(Time.Zero).value, 0);
            assert.strictEqual(lst.beatAt(new Time(1)).value, 2);
            assert.strictEqual(lst.beatAt(new Time(2)).value, 4);
            assert.strictEqual(lst.beatAt(new Time(3)).value, 5);
            assert.strictEqual(lst.beatAt(new Time(4)).value, 6);
        });
    });

    describe("#timeAt", () => {
        it("returns 0 if beat is 0", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert.strictEqual(lst.timeAt(Beat.Zero).value, 0);
        });

        it("works with one BPM change", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert.strictEqual(lst.timeAt(Beat.Zero).value, 0);
            assert.strictEqual(lst.timeAt(new Beat(1)).value, 0.5);
            assert.strictEqual(lst.timeAt(new Beat(2)).value, 1);
        });

        it("works with two BPM changes", () => {
            const lst = new BPMList([
                new BPM(Beat.Zero, 120),
                new BPM(new Beat(4), 60),
            ]);

            assert.strictEqual(lst.timeAt(Beat.Zero).value, 0);
            assert.strictEqual(lst.timeAt(new Beat(1)).value, 0.5);
            assert.strictEqual(lst.timeAt(new Beat(2)).value, 1);
            assert.strictEqual(lst.timeAt(new Beat(4)).value, 2);
            assert.strictEqual(lst.timeAt(new Beat(5)).value, 3);
        });
    });
});

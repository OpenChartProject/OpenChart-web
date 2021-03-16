import assert from "assert";
import { Beat } from "./beat";
import { BPM } from "./bpm";
import { BPMList } from "./bpmList";

describe("BPMList", () => {
    describe("#setBPMS", () => {
        it("throws if list is empty", () => {
            assert.throws(() => new BPMList([]));
        });

        it("throws if the first BPM is not at beat 0", () => {
            assert.throws(() => new BPMList([new BPM(new Beat(1), 120)]));
        });
    });

    describe("#timeAt", () => {
        it("returns 0 if beat is 0", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert(lst.timeAt(Beat.Zero).value === 0);
        });

        it("works with one BPM change", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert.strictEqual(lst.timeAt(new Beat(1)).value, 0.5);
            assert.strictEqual(lst.timeAt(new Beat(2)).value, 1);
        });

        it("works with two BPM changes", () => {
            const lst = new BPMList([
                new BPM(Beat.Zero, 120),
                new BPM(new Beat(4), 60),
            ]);
            assert.strictEqual(lst.timeAt(new Beat(1)).value, 0.5);
            assert.strictEqual(lst.timeAt(new Beat(2)).value, 1);
            assert.strictEqual(lst.timeAt(new Beat(4)).value, 2);
            assert.strictEqual(lst.timeAt(new Beat(5)).value, 3);
        });
    });
});

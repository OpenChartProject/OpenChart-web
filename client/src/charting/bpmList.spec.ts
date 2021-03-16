import assert from "assert";
import { Beat } from "./beat";
import { BPM } from "./bpm";
import { BPMList } from "./bpmList";

describe("BPMList", () => {
    describe("#timeAt", () => {
        it("throws an error when empty", () => {
            assert.throws(() => new BPMList().timeAt(Beat.Zero));
        });

        it("returns 0 if beat is 0", () => {
            const lst = new BPMList([new BPM(Beat.Zero, 120)]);
            assert(lst.timeAt(Beat.Zero).value === 0);
        });
    });
});

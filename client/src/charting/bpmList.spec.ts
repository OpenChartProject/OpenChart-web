import assert from "assert";

import { BPM } from "./bpm";
import { BPMList, BPMTime } from "./bpmList";
import { Time } from "./time";

describe("BPMList", () => {
    describe("new", () => {
        it("sets a default is no BPMs are provided", () => {
            const list = new BPMList();
            const expected: BPMTime[] = [
                {
                    bpm: new BPM(0, 120),
                    time: new Time(0),
                },
            ];

            assert.deepStrictEqual(list.getAll(), expected);
        });
    });

    describe("#beatAt", () => {
        it("returns 0 if time is 0", () => {
            const list = new BPMList([new BPM(0, 120)]);
            assert.strictEqual(list.beatAt(0).value, 0);
        });

        it("works with one BPM change", () => {
            const list = new BPMList([new BPM(0, 120)]);
            assert.strictEqual(list.beatAt(0).value, 0);
            assert.strictEqual(list.beatAt(1).value, 2);
            assert.strictEqual(list.beatAt(2).value, 4);
        });

        it("works with two BPM changes", () => {
            const list = new BPMList([new BPM(0, 120), new BPM(4, 60)]);

            assert.strictEqual(list.beatAt(0).value, 0);
            assert.strictEqual(list.beatAt(1).value, 2);
            assert.strictEqual(list.beatAt(2).value, 4);
            assert.strictEqual(list.beatAt(3).value, 5);
            assert.strictEqual(list.beatAt(4).value, 6);
        });
    });

    describe("#get", () => {
        it("throws if the index is out of range", () => {
            const list = new BPMList();
            assert.throws(() => list.get(-1));
            assert.throws(() => list.get(1));
        });

        it("returns the bpm at the given index", () => {
            const bpms = [new BPM(0, 120), new BPM(4, 60)];
            const list = new BPMList(bpms);
            const all = list.getAll();

            assert.deepStrictEqual([list.get(0), list.get(1)], all);
        });
    });

    describe("#getAll", () => {
        it("returns a list of all the BPMs", () => {
            const bpms = [new BPM(0, 120), new BPM(4, 60)];
            const list = new BPMList(bpms);
            const result = list.getAll();
            const expected: BPMTime[] = [
                {
                    bpm: bpms[0],
                    time: list.timeAt(bpms[0].beat),
                },
                {
                    bpm: bpms[1],
                    time: list.timeAt(bpms[1].beat),
                },
            ];

            assert.deepStrictEqual(result, expected);
        });

        it("returns a copy", () => {
            const list = new BPMList();

            assert.notStrictEqual(list.getAll(), list.getAll());
        });
    });

    describe("#removeDuplicates", () => {
        it("removes and returns duplicate BPMs", () => {
            const bpms = [new BPM(0, 120), new BPM(4, 120)];
            const list = new BPMList(bpms);
            const dupes = list.removeDuplicates().map((val) => val.bpm);

            assert.deepStrictEqual(dupes, [bpms[1]]);
            assert.deepStrictEqual(
                list.getAll().map((val) => val.bpm),
                [bpms[0]],
            );
        });
    });

    describe("#setBPMS", () => {
        it("throws if list is empty", () => {
            assert.throws(() => new BPMList([]));
        });

        it("throws if none of the bpms are at beat 0", () => {
            assert.throws(() => new BPMList([new BPM(1, 120)]));
        });

        it("calculates the time of each bpm", () => {
            const list = new BPMList([new BPM(0, 120), new BPM(4, 60)]);

            assert.strictEqual(list.get(0).time.value, 0);
            assert.strictEqual(list.get(1).time.value, 2);
        });

        it("reorders the bpms by beat ascending", () => {
            const bpms = [new BPM(4, 60), new BPM(0, 120)];
            const expected = [bpms[1], bpms[0]];
            const list = new BPMList(bpms);

            assert.deepStrictEqual(
                list.getAll().map((bpm) => bpm.bpm),
                expected,
            );
        });
    });

    describe("#timeAt", () => {
        it("returns 0 if beat is 0", () => {
            const list = new BPMList([new BPM(0, 120)]);
            assert.strictEqual(list.timeAt(0).value, 0);
        });

        it("works with one BPM change", () => {
            const list = new BPMList([new BPM(0, 120)]);
            assert.strictEqual(list.timeAt(0).value, 0);
            assert.strictEqual(list.timeAt(1).value, 0.5);
            assert.strictEqual(list.timeAt(2).value, 1);
        });

        it("works with two BPM changes", () => {
            const list = new BPMList([new BPM(0, 120), new BPM(4, 60)]);

            assert.strictEqual(list.timeAt(0).value, 0);
            assert.strictEqual(list.timeAt(1).value, 0.5);
            assert.strictEqual(list.timeAt(2).value, 1);
            assert.strictEqual(list.timeAt(4).value, 2);
            assert.strictEqual(list.timeAt(5).value, 3);
        });
    });

    describe("#update", () => {
        it("throws if the index is out of range", () => {
            const list = new BPMList();
            const bpm = new BPM(0, 60);
            assert.throws(() => list.update(-1, bpm));
            assert.throws(() => list.update(1, bpm));
        });

        it("updates the BPM at the given index", () => {
            const list = new BPMList();
            const bpm = new BPM(0, 60);
            list.update(0, bpm);

            assert.deepStrictEqual(list.get(0).bpm, bpm);
        });

        it("sorts the bpm list by beat ascending", () => {
            const list = new BPMList([new BPM(0, 120), new BPM(2, 60), new BPM(4, 90)]);
            const bpm = list.get(1).bpm;
            bpm.beat.value = 10;
            list.update(1, bpm);

            const actual: BPM[] = list.getAll().map((x) => x.bpm);
            const expected: BPM[] = [new BPM(0, 120), new BPM(4, 90), new BPM(10, 60)];

            assert.deepStrictEqual(actual, expected);
        });

        it("recalculates the bpm times", () => {
            const list = new BPMList([new BPM(0, 120), new BPM(2, 60), new BPM(4, 90)]);
            const bpm = list.get(1).bpm;
            bpm.beat.value = 10;
            list.update(1, bpm);

            const actual: number[] = list.getAll().map((x) => x.time.value);
            const expected: number[] = [0, 2, 6];

            assert.deepStrictEqual(actual, expected);
        });
    });
});

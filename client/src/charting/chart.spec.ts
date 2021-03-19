import assert from "assert";
import { Beat } from "./beat";
import { BPM } from "./bpm";
import { BPMList } from "./bpmList";
import { Chart } from "./chart";
import { KeyCount } from "./keyCount";
import { KeyIndex } from "./keyIndex";
import { Tap } from "./objects/tap";
import { Time } from "./time";

describe("Chart", () => {
    describe("new", () => {
        it("sets defaults", () => {
            const c = new Chart();
            assert.deepStrictEqual(c.bpms, new BPMList());
            assert.strictEqual(c.keyCount.value, 4);
            assert.deepStrictEqual(c.objects, [[], [], [], []]);
        });
    });

    describe("#getObjectsInInterval", () => {
        it("throws if key index is out of range", () => {
            const c = new Chart();
            const t = [new Time(0), new Time(1)];

            assert.throws(() =>
                c.getObjectsInInterval(new KeyIndex(5), t[0], t[1]),
            );
        });

        it("throws if start doesn't come before end", () => {
            const c = new Chart();
            const t = [new Time(1), new Time(0)];

            assert.throws(() =>
                c.getObjectsInInterval(new KeyIndex(0), t[0], t[1]),
            );
        });

        it("returns objects for each key", () => {
            const objs = [
                [new Tap(new Beat(0), new KeyIndex(0))],
                [new Tap(new Beat(1), new KeyIndex(1))],
            ];
            const c = new Chart(undefined, new KeyCount(2), objs);
            const t = [new Time(0), new Time(1)];

            assert.deepStrictEqual(
                c.getObjectsInInterval(new KeyIndex(0), t[0], t[1]),
                objs[0],
            );
            assert.deepStrictEqual(
                c.getObjectsInInterval(new KeyIndex(1), t[0], t[1]),
                objs[1],
            );
        });

        it("doesn't return objects outside the interval", () => {
            const c = new Chart();
            c.bpms.setBPMs([new BPM(new Beat(0), 60)]);

            const objs = [
                new Tap(new Beat(0), new KeyIndex(0)),
                new Tap(new Beat(1), new KeyIndex(0)),
                new Tap(new Beat(2), new KeyIndex(0)),
            ];
            c.objects[0] = objs;

            assert.deepStrictEqual(
                c.getObjectsInInterval(
                    new KeyIndex(0),
                    new Time(0),
                    new Time(1),
                ),
                objs.slice(0, 2),
            );
            assert.deepStrictEqual(
                c.getObjectsInInterval(
                    new KeyIndex(0),
                    new Time(1),
                    new Time(2),
                ),
                objs.slice(1, 3),
            );
        });
    });
});

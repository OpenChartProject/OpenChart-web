import assert from "assert";
import { BPM } from "./bpm";
import { BPMList } from "./bpmList";
import { Chart } from "./chart";
import { Hold } from "./objects/hold";
import { Tap } from "./objects/tap";

describe("Chart", () => {
    describe("new", () => {
        it("sets defaults", () => {
            const c = new Chart();
            assert.deepStrictEqual(c.bpms, new BPMList());
            assert.strictEqual(c.keyCount.value, 4);
            assert.deepStrictEqual(c.objects, [[], [], [], []]);
        });
    });

    describe("#placeObject", () => {
        let c: Chart;

        beforeEach(() => (c = new Chart()));

        it("throws if key index is out of range", () => {
            assert.throws(() => c.placeObject(new Tap(0, c.keyCount.value)));
        });

        it("returns true if object is added", () => {
            const ret = c.placeObject(new Tap(0, 0));
            assert.strictEqual(ret, true);
        });

        it("returns false if object is not added", () => {
            const tap = new Tap(0, 0);
            const hold = new Hold(0, 1, 0);
            c.placeObject(tap);
            const ret = c.placeObject(hold);
            assert.strictEqual(ret, false);
            assert.deepStrictEqual(c.objects[0], [tap]);
        });

        it("adds object when list is empty", () => {
            const obj = new Tap(0, 0);
            c.placeObject(obj);
            assert.deepStrictEqual(c.objects, [[obj], [], [], []]);
        });

        it("adds object to appropriate key", () => {
            for (let i = 0; i < c.keyCount.value; i++) {
                const obj = new Tap(0, i);
                c.placeObject(obj);
                assert.deepStrictEqual(c.objects[i], [obj]);
            }
        });

        it("adds object before existing object", () => {
            const obj = [new Tap(1, 0), new Tap(0, 0)];
            c.placeObject(obj[0]);
            c.placeObject(obj[1]);
            assert.deepStrictEqual(c.objects[0], [obj[1], obj[0]]);
        });

        it("adds object after existing object", () => {
            const obj = [new Tap(0, 0), new Tap(1, 0)];
            c.placeObject(obj[0]);
            c.placeObject(obj[1]);
            assert.deepStrictEqual(c.objects[0], [obj[0], obj[1]]);
        });

        it("removes existing object if option is set", () => {
            const obj = new Tap(0, 0);
            c.placeObject(obj);
            c.placeObject(obj, { removeIfExists: true });
            assert.deepStrictEqual(c.objects[0], []);
        });

        it("returns true if object is removed", () => {
            const obj = new Tap(0, 0);
            c.placeObject(obj);
            const ret = c.placeObject(obj, { removeIfExists: true });
            assert.strictEqual(ret, true);
        });
    });

    describe("#getObjectsInInterval", () => {
        it("throws if key index is out of range", () => {
            const c = new Chart();

            assert.throws(() => c.getObjectsInInterval(c.keyCount.value, 0, 1));
        });

        it("throws if start doesn't come before end", () => {
            const c = new Chart();

            assert.throws(() => c.getObjectsInInterval(0, 1, 0));
        });

        it("returns objects for each key", () => {
            const objs = [[new Tap(0, 0)], [new Tap(1, 1)]];
            const c = new Chart({ keyCount: 2, objects: objs });

            assert.deepStrictEqual(c.getObjectsInInterval(0, 0, 1), objs[0]);
            assert.deepStrictEqual(c.getObjectsInInterval(1, 0, 1), objs[1]);
        });

        it("doesn't return objects outside the interval", () => {
            const c = new Chart();
            c.bpms.setBPMs([new BPM(0, 60)]);

            const objs = [new Tap(0, 0), new Tap(1, 0), new Tap(2, 0)];
            c.objects[0] = objs;

            assert.deepStrictEqual(
                c.getObjectsInInterval(0, 0, 1),
                objs.slice(0, 2),
            );
            assert.deepStrictEqual(
                c.getObjectsInInterval(0, 1, 2),
                objs.slice(1, 3),
            );
        });
    });
});

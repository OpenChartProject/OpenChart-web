import { BPMList } from "./bpmList";
import { ChartObject } from "./objects/chartObject";
import { KeyCount } from "./keyCount";
import { Time } from "./time";
import { KeyIndex } from "./keyIndex";
import assert from "assert";

export type KeyObjects = ChartObject[];

export class Chart {
    bpms: BPMList;
    keyCount: KeyCount;
    objects: KeyObjects[];

    constructor(bpms?: BPMList, keyCount?: KeyCount, objects?: KeyObjects[]) {
        this.bpms = bpms ?? new BPMList();
        this.keyCount = keyCount ?? new KeyCount(4);

        if (objects === undefined) {
            this.objects = [];

            for (let i = 0; i < this.keyCount.value; i++) {
                this.objects.push([]);
            }
        } else {
            this.objects = objects;
        }
    }

    getObjectsInInterval(key: KeyIndex, start: Time, end: Time): KeyObjects {
        assert(key.value < this.keyCount.value, "key index is out of range");
        assert(start.value < end.value, "start must come before end");

        const objs: KeyObjects = [];

        for (const obj of this.objects[key.value]) {
            // TODO: Calculate this ahead of time
            const t = this.bpms.timeAt(obj.beat);

            if (t.value < start.value || t.value > end.value) {
                continue;
            }

            objs.push(obj);
        }

        return objs;
    }
}

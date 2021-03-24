import { makeAutoObservable } from "mobx";
import { BPMList } from "./bpmList";
import { ChartObject } from "./objects/chartObject";
import { KeyCount } from "./keyCount";
import { Time } from "./time";
import { KeyIndex } from "./keyIndex";
import assert from "assert";
import { toKeyCount, toKeyIndex, toTime } from "./util";

/**
 * A list of ChartObjects for a key/column.
 */
export type KeyObjects = ChartObject[];

export interface ChartOpts {
    bpms?: BPMList;
    keyCount?: KeyCount | number;
    objects?: KeyObjects[];
}

/**
 * A chart combines BPMs with ChartObjects. It provides some useful methods for both
 * adding new objects and finding existing ones.
 */
export class Chart {
    bpms: BPMList;
    readonly keyCount: Readonly<KeyCount>;
    objects: KeyObjects[];

    constructor({ bpms, keyCount, objects }: ChartOpts = {}) {
        makeAutoObservable(this);

        this.bpms = bpms ?? new BPMList();

        if (keyCount !== undefined) {
            this.keyCount = toKeyCount(keyCount!);
        } else {
            this.keyCount = toKeyCount(4);
        }

        if (objects === undefined) {
            this.objects = [];

            for (let i = 0; i < this.keyCount.value; i++) {
                this.objects.push([]);
            }
        } else {
            this.objects = objects;
        }
    }

    /**
     * Places an object on the chart. By default, if you attempt to place an object
     * over an existing object, it will remove the existing object instead.
     *
     * @returns true if the chart was modified
     */
    placeObject(obj: ChartObject, { removeIfExists = false } = {}): boolean {
        assert(
            obj.key.value < this.keyCount.value,
            "key index is out of range",
        );

        // TODO: optimize this
        const objList = this.objects[obj.key.value];
        const i = objList.findIndex((o) => o.beat.value === obj.beat.value);

        if (i !== -1) {
            if (removeIfExists === true) {
                objList.splice(i, 1);
                return true;
            } else {
                return false;
            }
        }

        objList.push(obj);
        objList.sort((a, b) => (a.beat.value < b.beat.value ? -1 : 1));

        return true;
    }

    getObjectsInInterval(
        key: KeyIndex | number,
        start: Time | number,
        end: Time | number,
    ): KeyObjects {
        key = toKeyIndex(key);
        start = toTime(start);
        end = toTime(end);

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

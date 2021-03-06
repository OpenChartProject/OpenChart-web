import { BPMList } from "./bpmList";
import { ChartObject } from "./objects/chartObject";
import { KeyCount } from "./keyCount";

export class Chart {
    bpms: BPMList;
    keyCount: KeyCount;
    objects: ChartObject[];

    constructor(
        bpms: BPMList = null,
        keyCount: KeyCount = null,
        objects: ChartObject[] = null
    ) {
        this.bpms = bpms ?? new BPMList();
        this.keyCount = keyCount ?? new KeyCount(4);
        this.objects = objects ?? [];
    }
}

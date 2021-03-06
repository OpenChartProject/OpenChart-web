import { BPM } from "./bpm";

export class BPMList {
    bpms: BPM[];

    constructor(bpms: BPM[] = null) {
        this.bpms = bpms ?? [];
    }
}

import { BPM } from "./bpm";

export class BPMList {
    bpms: BPM[];

    constructor(bpms?: BPM[]) {
        this.bpms = bpms ?? [];
    }
}

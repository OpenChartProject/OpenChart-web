import WaveformData from "waveform-data";
import { RootStore } from "./store";

export class Waveform {
    data?: WaveformData;
    el: SVGElement;
    store: RootStore;

    constructor(store: RootStore, el: SVGElement) {
        this.el = el;
        this.store = store;
    }
}

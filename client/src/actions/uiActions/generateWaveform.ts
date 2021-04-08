import { RootStore } from "../../store";
import { Action } from "../action";

export interface GenerateWaveformArgs {
    audioData: ArrayBuffer;
}

export class GenerateWaveformAction implements Action {
    args: GenerateWaveformArgs;
    store: RootStore;

    constructor(store: RootStore, args: GenerateWaveformArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { waveform } = this.store;

        waveform.setAudioData(this.args.audioData).then(() => {
            waveform.generateSVG(500, 200);
        });
    }
}

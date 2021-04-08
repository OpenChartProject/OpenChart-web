import { RootStore } from "../../store";
import { Action } from "../action";

export interface GenerateWaveformArgs {
    audioData?: ArrayBuffer;
}

export class GenerateWaveformAction implements Action {
    args: GenerateWaveformArgs;
    store: RootStore;

    constructor(store: RootStore, args: GenerateWaveformArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { audioData } = this.args;
        const { waveform } = this.store;

        if (audioData) {
            waveform.setAudioData(audioData).then(() => {
                waveform.generateSVG(500, 200);
            });
        } else {
            waveform.generateSVG(500, 200);
        }
    }
}

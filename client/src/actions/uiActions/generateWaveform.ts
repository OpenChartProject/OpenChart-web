import WaveformData from "waveform-data";

import { RootStore } from "../../store";
import { Action } from "../action";

export interface GenerateWaveformArgs {
    data: ArrayBuffer;
}

export class GenerateWaveformAction implements Action {
    args: GenerateWaveformArgs;
    store: RootStore;

    constructor(store: RootStore, args: GenerateWaveformArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const ctx = new AudioContext();

        ctx.decodeAudioData(this.args.data)
            .then((audioBuffer) => {
                const options = {
                    audio_context: ctx,
                    audio_buffer: audioBuffer,
                    scale: 128,
                };

                return new Promise<WaveformData>((resolve, reject) => {
                    WaveformData.createFromAudio(options, (err, waveform) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(waveform);
                        }
                    });
                });
            })
            .then((waveform) => {
                console.log(`Waveform has ${waveform.channels} channels`);
                console.log(`Waveform has length ${waveform.length} points`);
            });
    }
}

import * as d3 from "d3";
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
                    scale: 512,
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
                this.generateSVG(waveform);
            });
    }

    private generateSVG(waveform: WaveformData) {
        const width = 2000;
        const height = 200;
        waveform.resample({ width });
        const channel = waveform.channel(0);
        const container = d3.select('#waveform-container');
        const x = d3.scaleLinear();
        const y = d3.scaleLinear();

        const min = channel.min_array();
        const max = channel.max_array();

        x.domain([0, waveform.length]).rangeRound([0, width]);
        y.domain([d3.min(min), d3.max(max)] as number[]).rangeRound([(height / 2), -(height / 2)]);

        const area = d3.area()
            .x((d, i) => x(i))
            .y0((d, i) => y(min[i]))
            .y1((d, i) => y(d as any));

        container.select('svg').remove();

        container.append('svg')
            .style('width', width + "px")
            .style('height', height + "px")
            .datum(max)
            .append('path')
            .attr('transform', () => `translate(0, ${height / 2})`)
            .attr("d", area as any)
            .attr('fill', "white");
    }
}

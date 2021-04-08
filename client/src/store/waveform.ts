import * as d3 from "d3";
import _ from "lodash";
import { makeAutoObservable, makeObservable, observable } from "mobx";
import WaveformData from "waveform-data";

import { RootStore } from "./store";

export interface WaveformStoreData {
    audioData?: ArrayBuffer;
    el: WaveformElement[];
    waveform?: WaveformData;
}

export interface WaveformElement {
    data: WaveformData;
    svg: SVGElement;
}

export class WaveformStore {
    data: WaveformStoreData;
    root: RootStore;

    constructor(store: RootStore) {
        makeAutoObservable(this);
        this.root = store;
        this.data = makeObservable({ el: [] }, { el: observable.ref });
    }

    get duration(): number {
        if (!this.data.waveform) {
            return 0;
        }

        return this.data.waveform.duration;
    }

    get scales(): number[] {
        return [64, 128, 512, 1024];
    }

    get width(): number {
        return this.duration * this.root.noteField.pixelsPerSecond;
    }

    generateAll() {
        this.data.el = this.scales.map(val => this.generate(val));
    }

    /**
     * Generates a SVG of the waveform with the given height and returns it.
     */
    generate(scale: number): WaveformElement {
        const waveform = (this.data.waveform as WaveformData).resample({ scale });

        const width = this.width;
        const height = 500;
        const channel = waveform.channel(0);
        const x = d3.scaleLinear();
        const y = d3.scaleLinear();

        const min = channel.min_array();
        const max = channel.max_array();

        x.domain([0, waveform.length]).rangeRound([0, width]);
        y.domain([d3.min(min), d3.max(max)] as number[]).rangeRound([height / 2, -(height / 2)]);

        const area = d3
            .area()
            .x((d, i) => x(i))
            .y0((d, i) => y(min[i]))
            .y1((d, i) => y(d as any));

        const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        d3.select(el)
            .datum(max)
            .append("path")
            .attr("d", area as any)
            .attr("fill", "white")
            .datum(max);

        return {
            svg: el,
            data: waveform,
        };
    }

    /**
     * Generates a WaveformData object for the given data and returns a promise that is
     * resolved once the WaveformData object is ready.
     */
    private generateWaveformData(data: ArrayBuffer): Promise<WaveformData> {
        return new Promise<WaveformData>((resolve) => {
            const ctx = new AudioContext();

            ctx.decodeAudioData(data)
                .then((audioBuffer) => {
                    const options = {
                        audio_context: ctx,
                        audio_buffer: audioBuffer,

                        // This is the number of samples per pixel parsed by the waveform library.
                        // Smaller scale = higher resolution = slower to generate
                        scale: _.min(this.scales),
                    };

                    return new Promise<WaveformData>((innerResolve, innerReject) => {
                        WaveformData.createFromAudio(options, (err, waveform) => {
                            if (err) {
                                innerReject(err);
                            } else {
                                innerResolve(waveform);
                            }
                        });
                    });
                })
                .then((waveform) => {
                    resolve(waveform);
                });
        });
    }

    /**
     * Sets the audio data to use for the waveform.
     */
    setAudioData(data: ArrayBuffer): Promise<void> {
        if (data === this.data.audioData) {
            return new Promise<void>((resolve) => resolve());
        }

        return new Promise<void>((resolve) => {
            this.generateWaveformData(data).then((waveformData) => {
                this.data.waveform = waveformData;
                resolve();
            });
        });
    }
}

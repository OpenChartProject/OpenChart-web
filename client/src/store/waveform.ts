import assert from "assert";
import * as d3 from "d3";
import WaveformData from "waveform-data";

import { RootStore } from "./store";

export class WaveformStore {
    audioData?: ArrayBuffer;
    el?: SVGElement;
    waveform?: WaveformData;
    store: RootStore;

    constructor(store: RootStore) {
        this.store = store;
    }

    /**
     * Generates a SVG of the waveform with the given width and height and returns it.
     */
    generateSVG(width: number, height: number) {
        assert(this.el, "an SVG element must be set before generating the waveform");

        const waveform = this.waveform as WaveformData;
        waveform.resample({ width });

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

        const svg = d3.select(this.el);

        svg.style("width", width + "px")
            .style("height", height + "px")
            .datum(max);

        svg.append("path")
            .attr("transform", () => `translate(0, ${height / 2})`)
            .attr("d", area as any)
            .attr("fill", "white");
    }

    /**
     * Generates a WaveformData object for the given data and returns a promise that is
     * resolved once the WaveformData object is ready.
     */
    generateWaveformData(data: ArrayBuffer): Promise<WaveformData> {
        return new Promise<WaveformData>((resolve) => {
            const ctx = new AudioContext();

            ctx.decodeAudioData(data)
                .then((audioBuffer) => {
                    const options = {
                        audio_context: ctx,
                        audio_buffer: audioBuffer,
                        scale: 512,
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
        if (data === this.audioData) {
            return new Promise<void>((resolve) => resolve());
        }

        return new Promise<void>((resolve) => {
            this.generateWaveformData(data).then((waveformData) => {
                this.waveform = waveformData;
                resolve();
            });
        });
    }

    setElement(el: SVGElement) {
        this.el = el;
    }
}

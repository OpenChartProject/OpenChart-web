import * as d3 from "d3";
import { min as arrayMin } from "lodash";
import { makeAutoObservable, makeObservable, observable } from "mobx";
import WaveformData from "waveform-data";

import { RootStore } from "./root";

export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * WaveformElement holds the waveform SVG and the data used for that SVG.
 */
export interface WaveformElement {
    data: WaveformData;
    svg: SVGElement;
}

/**
 * This stores the audio data and the various SVGs of the waveforms. Each WaveformElement
 * represents a different zoom level. Without zoom levels the waveform will have too
 * much detail when the user zooms out the notefield, and it causes serious lag.
 */
export interface WaveformStoreData {
    audioData?: ArrayBuffer;
    el: WaveformElement[];
    waveform?: WaveformData;
}

/**
 * This stores the waveform data for the currently loaded audio.
 */
export class WaveformStore {
    data: WaveformStoreData;
    root: RootStore;

    /**
     * Used for calculating the viewBox. This is not actually the height of the waveform.
     *
     * You probably want the `width` getter.
     */
    readonly WAVEFORM_HEIGHT = 500;

    constructor(store: RootStore) {
        makeAutoObservable(this);
        this.root = store;
        this.data = makeObservable({ el: [] }, { el: observable.ref });
    }

    /**
     * Returns the duration of the waveform, in seconds.
     */
    get duration(): number {
        if (!this.data.waveform) {
            return 0;
        }

        return this.data.waveform.duration;
    }

    /**
     * This returns the different scaling/zoom levels for the waveforms.
     */
    get scales(): number[] {
        return [64, 128, 256, 512, 1024, 2048];
    }

    /**
     * Returns the viewbox for the waveform SVG. This viewbox depends on the current zoom
     * and scroll of the notefield.
     */
    get viewBox(): ViewBox {
        const { notefield } = this.root;
        const { receptorY, scrollDirection } = this.root.notefieldDisplay.data;
        const zoom = notefield.data.zoom.valueOf();
        const height = notefield.data.height;

        let y0 =
            (notefield.data.scroll.time.value - notefield.data.audioOffset) *
            notefield.pixelsPerSecond;

        if (scrollDirection === "down") {
            y0 = -(y0 + notefield.data.height);
            y0 += receptorY;
        } else {
            y0 -= receptorY;
        }

        return {
            x: -(this.WAVEFORM_HEIGHT / 2),
            y: y0 / zoom,
            width: this.WAVEFORM_HEIGHT,
            height: height / zoom,
        };
    }

    /**
     * This returns the size of the waveform, in pixels.
     *
     * The waveform is generated to be horizontal and then rotated to be vertical, which
     * is why this is called "width" and not "height".
     */
    get width(): number {
        return this.duration * this.root.notefield.pixelsPerSecond;
    }

    /**
     * Generates waveforms at different zoom levels and returns them.
     */
    generateAll(): WaveformElement[] {
        this.data.el = this.scales.map((val) => this.generate(val));
        return this.data.el;
    }

    /**
     * Generates a SVG of the waveform with the given scale and returns it.
     */
    generate(scale: number): WaveformElement {
        const waveform = (this.data.waveform as WaveformData).resample({ scale });

        const width = this.width;
        const height = this.WAVEFORM_HEIGHT;
        const channel = waveform.channel(0);
        const x = d3.scaleLinear();
        const y = d3.scaleLinear();

        const min = channel.min_array();
        const max = channel.max_array();

        x.domain([0, waveform.length]).rangeRound([0, width]);
        y.domain([d3.min(min), d3.max(max)] as number[]).rangeRound([height / 2, -(height / 2)]);

        const area = d3
            .area()
            .x((_, i) => x(i))
            .y0((_, i) => y(min[i]))
            .y1((d, _) => y(d as any));

        const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        d3.select(el)
            .datum(max)
            .append("path")
            .attr("d", area as any);

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
                        scale: arrayMin(this.scales),
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
     * Returns the most appropriate waveform, given a pixels per second value.
     *
     * If no waveforms have been generated yet it returns null.
     *
     * This compares all of the PPS values for the zoom levels and returns the element
     * that closest matches the provided PPS.
     */
    getBestMatchingWaveform(pps: number): WaveformElement | null {
        if (this.data.el.length === 0) {
            return null;
        }

        let lastDiff = Number.MAX_VALUE;
        let index = 0;

        for (let i = 0; i < this.data.el.length; i++) {
            const el = this.data.el[i];
            const diff = Math.abs(el.data.pixels_per_second - pps);

            if (diff < lastDiff) {
                lastDiff = diff;
                index = i;
            }
        }

        return this.data.el[index];
    }

    /**
     * Sets the audio data to use for the waveform. This returns a promise that is resolved
     * once the audio has been processed and is ready to use.
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

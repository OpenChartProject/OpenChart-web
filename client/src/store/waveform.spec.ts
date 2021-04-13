import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { Beat, BeatTime, Time } from "../charting";
import { createStore, TestData } from "../test";

import { ScrollDirection } from "./notefieldDisplay";
import { ViewBox, WaveformElement, WaveformStore } from "./waveform";

describe("WaveformStore", () => {
    describe("duration", () => {
        it("returns 0 if no waveform data is set", () => {
            const store = createStore().waveform;
            assert.strictEqual(store.duration, 0);
        });

        it("returns the waveform duration", () => {
            const store = createStore().waveform;
            const duration = 123;
            store.data.waveform = {
                duration,
            } as any;

            assert.strictEqual(store.duration, duration);
        });
    });

    describe("viewBox", () => {
        interface TestCase {
            notefield: {
                audioOffset: number;
                height: number;
                receptorY: number;
                scroll: BeatTime;
                scrollDirection: ScrollDirection;
                zoom: number;
            };
            expected: ViewBox;
            when: string;
        }

        function beatTime(beat: number, time: number): BeatTime {
            return {
                beat: new Beat(beat),
                time: new Time(time),
            };
        }

        const cases: TestCase[] = [
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "down",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -100,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "no offset, scroll, or zoom (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "up",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 0,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "no offset, scroll, or zoom (upscroll)",
            },
            ////////////////////////////////////////////////////
            {
                notefield: {
                    audioOffset: 0.5,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "down",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 156,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the audio offset is set (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 0.5,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "up",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -256,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the audio offset is set (upscroll)",
            },
            ////////////////////////////////////////////////////
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "down",
                    zoom: 2,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -50,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 50,
                },
                when: "the zoom is set (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(0, 0),
                    scrollDirection: "up",
                    zoom: 2,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 0,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 50,
                },
                when: "the zoom is set (upscroll)",
            },
            ////////////////////////////////////////////////////
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 200,
                    scroll: beatTime(0, 0),
                    scrollDirection: "down",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 100,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the receptors are moved (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 200,
                    scroll: beatTime(0, 0),
                    scrollDirection: "up",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -200,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the receptors are moved (upscroll)",
            },
            ////////////////////////////////////////////////////
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(2, 1),
                    scrollDirection: "down",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -612,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the notefield is scrolled (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 0,
                    height: 100,
                    receptorY: 0,
                    scroll: beatTime(2, 1),
                    scrollDirection: "up",
                    zoom: 1,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 512,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 100,
                },
                when: "the notefield is scrolled (upscroll)",
            },
            ////////////////////////////////////////////////////
            {
                notefield: {
                    audioOffset: 1.5,
                    height: 100,
                    receptorY: 50,
                    scroll: beatTime(2, 1),
                    scrollDirection: "down",
                    zoom: 0.5,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: 156,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 200,
                },
                when: "everything is modified (downscroll)",
            },
            {
                notefield: {
                    audioOffset: 1.5,
                    height: 100,
                    receptorY: 50,
                    scroll: beatTime(2, 1),
                    scrollDirection: "up",
                    zoom: 0.5,
                },
                expected: {
                    x: -(WaveformStore.WAVEFORM_HEIGHT / 2),
                    y: -356,
                    width: WaveformStore.WAVEFORM_HEIGHT,
                    height: 200,
                },
                when: "everything is modified (upscroll)",
            },
        ];

        cases.forEach((c) => {
            it(`should return the expected viewBox when ${c.when}`, () => {
                const { notefield, notefieldDisplay, waveform } = createStore();

                notefield.setAudioOffset(c.notefield.audioOffset);
                notefield.setHeight(c.notefield.height);
                notefield.setScroll(c.notefield.scroll);
                notefield.setZoom(new Fraction(c.notefield.zoom));

                notefieldDisplay.update({
                    receptorY: c.notefield.receptorY,
                    scrollDirection: c.notefield.scrollDirection,
                });

                assert.deepStrictEqual(waveform.viewBox, c.expected);
            });
        });
    });

    describe("width", () => {
        it("returns 0 if no waveform data is set", () => {
            const store = createStore().waveform;
            assert.strictEqual(store.width, 0);
        });

        it("returns the waveform width", () => {
            const { notefield, waveform } = createStore();
            const pps = notefield.pixelsPerSecond;
            const duration = 123;
            waveform.data.waveform = {
                duration,
            } as any;

            assert.strictEqual(waveform.width, duration * pps);
        });
    });

    describe("#generateAll", () => {
        it("generates waveforms for each scale", () => {
            const store = createStore().waveform;
            const stub = sinon.stub(store, "generate");
            const els = store.generateAll();

            assert.strictEqual(els.length, store.scales.length);

            // Verify we have a WaveformElement for each scale/zoom level.
            stub.getCalls().forEach((call, i) => {
                assert.strictEqual(call.firstArg, store.scales[i]);
            });
        });

        it("saves the generated WaveformElements in the store", () => {
            const store = createStore().waveform;
            sinon.stub(store, "generate");
            const els = store.generateAll();

            assert.deepStrictEqual(els, store.data.el);
        });
    });

    describe("#generate", () => {
        it("throws an error if the waveform data has not yet been generated", () => {
            const store = createStore().waveform;
            assert.throws(() => store.generate(1));
        });

        it("returns a resampled WaveformElement", () => {
            const store = createStore().waveform;
            store.data.waveform = TestData.audio.waveData;

            const scale = 300;
            const result = store.generate(scale);

            assert(result.svg);
            assert.strictEqual(result.data.scale, scale);
        });

        it("creates a new svg element", () => {
            const store = createStore().waveform;
            store.data.waveform = TestData.audio.waveData;

            assert.notStrictEqual(store.generate(300).svg, store.generate(300).svg);
        });
    });

    describe("#getBestMatchingWaveform", () => {
        it("returns null if no waveforms have been generated", () => {
            const store = createStore().waveform;
            assert.strictEqual(store.getBestMatchingWaveform(1), null);
        });

        // The fake pixel per second values that getBestMatchingWaveform will look at.
        const pps = [100, 200, 300];
        const fakeWaveforms: WaveformElement[] = pps.map((val) => {
            return {
                data: {
                    pixels_per_second: pps,
                },
            } as any;
        });

        interface TestCase {
            // The pps input to getBestMatchingWaveform
            input: number;

            // The index of the WaveformElement we are expecting
            expectedIndex: number;
        }

        const cases: TestCase[] = [
            {
                input: 50,
                expectedIndex: 0,
            },
            {
                input: 149,
                expectedIndex: 0,
            },
            {
                input: 150,
                expectedIndex: 1,
            },
            {
                input: 249,
                expectedIndex: 1,
            },
            {
                input: 99999,
                expectedIndex: 2,
            },
        ];

        cases.forEach((c) => {
            it(`should return index ${c.expectedIndex} when pps is ${c.input}`, () => {
                const store = createStore().waveform;
                store.data.el = fakeWaveforms;
                const el = store.getBestMatchingWaveform(c.input);

                assert.deepStrictEqual(el, fakeWaveforms[c.expectedIndex]);
            });
        });
    });

    describe("#setAudioData", () => {
        it("generates the waveform then resolves", (done) => {
            const store = createStore().waveform;
            const fakeAudioData: any = {};
            const fakeWaveformData: any = {};

            sinon
                .stub(store, "generateWaveformData")
                .withArgs(fakeAudioData)
                .resolves(fakeWaveformData);

            store.setAudioData(fakeAudioData).then(() => {
                assert.strictEqual(store.data.waveform, fakeWaveformData);
                done();
            });
        });

        it("does not generate the waveform if the data is the same", (done) => {
            const store = createStore().waveform;
            const fakeAudioData: any = {};
            store.data.audioData = fakeAudioData;

            const spy = sinon.spy(store, "generateWaveformData");

            store.setAudioData(fakeAudioData).then(() => {
                assert(spy.notCalled);
                done();
            });
        });
    });
});

import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { Beat, Chart, Time } from "../charting";
import { createStore } from "../testUtil";

import { ZOOM_MAX, ZOOM_MIN } from "./notefield";

describe("NotefieldStore", () => {
    describe("new", () => {
        it("creates a default chart", () => {
            const store = createStore().notefield;
            assert.deepStrictEqual(store.chart, new Chart());
        });

        it("creates the auto scroller", () => {
            const store = createStore();
            assert(store.notefield.autoScroller);
        });

        it("creates the music controller", () => {
            const store = createStore();
            assert(store.notefield.music);
        });
    });

    describe("#pixelsPerSecond", () => {
        it("returns expected value for 1:1 scaling", () => {
            const store = createStore();
            store.editor.data.pixelsPerSecond = 100;
            store.notefield.data.zoom = new Fraction(1);

            assert.deepStrictEqual(store.notefield.pixelsPerSecond, 100);
        });

        it("returns expected value for 2:1 scaling", () => {
            const store = createStore();
            store.editor.data.pixelsPerSecond = 100;
            store.notefield.data.zoom = new Fraction(2);

            assert.deepStrictEqual(store.notefield.pixelsPerSecond, 200);
        });
    });

    describe("#resetView", () => {
        it("resets the scroll and zoom", () => {
            const store = createStore().notefield;

            store.setScroll({ time: new Time(1) });
            store.setZoom(new Fraction(0.5));
            store.resetView();

            assert.strictEqual(store.data.scroll.time.value, 0);
            assert.strictEqual(store.data.zoom.valueOf(), 1);
        });
    });

    describe("#scrollBy", () => {
        it("throws if both beat and time are not set", () => {
            const store = createStore().notefield;
            assert.throws(() => store.scrollBy({}));
        });

        it("scrolls by the beat amount", () => {
            const store = createStore().notefield;

            store.setScroll({ beat: new Beat(1) });
            store.scrollBy({ beat: 1 });

            assert.deepStrictEqual(store.data.scroll.beat.value, 2);
        });

        it("scrolls by the time amount", () => {
            const store = createStore().notefield;

            store.setScroll({ time: new Time(1) });
            store.scrollBy({ time: 1 });

            assert.deepStrictEqual(store.data.scroll.time.value, 2);
        });

        it("sets scroll to 0 if beat would go negative", () => {
            const store = createStore().notefield;

            store.scrollBy({ beat: -1 });

            assert.deepStrictEqual(store.data.scroll.beat.value, 0);
        });

        it("sets scroll to 0 if time would go negative", () => {
            const store = createStore().notefield;

            store.scrollBy({ time: -1 });

            assert.deepStrictEqual(store.data.scroll.time.value, 0);
        });
    });

    describe("#setAudioOffset", () => {
        it("updates the offset", () => {
            const store = createStore().notefield;
            const offset = -0.5;

            store.setAudioOffset(offset);

            assert.strictEqual(store.data.audioOffset, offset);
        });
    });

    describe("#setCanvas", () => {
        it("sets the canvas element and updates the width", () => {
            const el = document.createElement("canvas");
            el.width = 123;

            const store = createStore().notefield;

            store.setCanvas(el as HTMLCanvasElement);
            assert.strictEqual(store.canvas, el);
            assert.strictEqual(store.canvas.width, store.data.width);
        });
    });

    describe("#setChart", () => {
        it("sets the chart", () => {
            const store = createStore().notefield;
            const chart = new Chart();

            store.setChart(chart);
            assert.strictEqual(chart, store.chart);
        });

        it("resets the view", () => {
            const store = createStore().notefield;
            const spy = sinon.spy(store, "resetView");

            store.setChart(store.chart);

            assert(spy.called);
        });
    });

    describe("#setHeight", () => {
        it("throws if the canvas isn't set", () => {
            const store = createStore().notefield;
            store.canvas = undefined;

            assert.throws(() => store.setHeight(0));
        });

        it("sets the canvas and internal height", () => {
            const store = createStore().notefield;
            const height = 123;

            store.setHeight(height);

            assert.strictEqual(store.canvas!.height, height);
            assert.strictEqual(store.data.height, height);
        });

        it("doesn't set the height if it hasn't changed", () => {
            const store = createStore().notefield;
            const spy = sinon.spy(store.canvas!, "height", ["set"]);
            const height = 123;

            store.setHeight(height);
            store.setHeight(height);
            assert(spy.set.calledOnce);
        });
    });

    describe("#setPlaying", () => {
        it("sets isPlaying", () => {
            const store = createStore().notefield;

            store.setPlaying(true);
            assert.strictEqual(store.data.isPlaying, true);

            store.setPlaying(false);
            assert.strictEqual(store.data.isPlaying, false);
        });

        it("pauses when passed false", () => {
            const store = createStore();
            const spy = sinon.spy(store.ui.controllers.music, "pause");

            store.notefield.setPlaying(true);
            store.notefield.setPlaying(false);
            assert(spy.calledOnce);

            // Check that it doesn't call pause if it's already paused.
            store.notefield.setPlaying(false);
            assert(spy.calledOnce);
        });

        it("plays when passed true", () => {
            const store = createStore();
            const autoScrollSpy = sinon.spy(store.notefield.autoScroller, "start");
            const seekSpy = sinon.spy(store.ui.controllers.music, "seek");
            const playSpy = sinon.spy(store.ui.controllers.music, "play");

            store.notefield.setPlaying(false);
            store.notefield.setPlaying(true);

            assert(autoScrollSpy.calledOnce);
            assert(seekSpy.calledOnceWith(store.notefield.data.scroll.time.value));
            assert(playSpy.calledOnce);

            store.notefield.setPlaying(true);

            // Check that it doesn't call these again if it's already playing
            assert(autoScrollSpy.calledOnce);
            assert(seekSpy.calledOnce);
            assert(playSpy.calledOnce);
        });
    });

    describe("#setScroll", () => {
        it("throws if both beat and time are not set", () => {
            const store = createStore().notefield;
            assert.throws(() => store.setScroll({}));
        });

        it("sets scroll using beat", () => {
            const store = createStore().notefield;

            const beat = new Beat(1.5);
            const time = store.chart.bpms.timeAt(beat);

            store.setScroll({ beat });

            assert.deepStrictEqual(store.data.scroll, { beat, time });
        });

        it("sets scroll using time", () => {
            const store = createStore().notefield;

            const time = new Time(1.5);
            const beat = store.chart.bpms.beatAt(time);

            store.setScroll({ beat });

            assert.deepStrictEqual(store.data.scroll, { beat, time });
        });
    });

    describe("#setZoom", () => {
        it("throws if zoom is <= 0", () => {
            const store = createStore().notefield;
            assert.throws(() => store.setZoom(new Fraction(0)));
            assert.throws(() => store.setZoom(new Fraction(-1)));
        });

        it("sets zoom", () => {
            const store = createStore().notefield;
            const val = new Fraction(1, 2);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, val);
        });

        it("sets zoom to min zoom", () => {
            const store = createStore().notefield;
            const val = new Fraction(1, 9999999);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, ZOOM_MIN);
        });

        it("sets zoom to max zoom", () => {
            const store = createStore().notefield;
            const val = new Fraction(9999999);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, ZOOM_MAX);
        });

        it("doesn't set the zoom if it's already the same");
    });

    describe("#updateWidth", () => {
        it("throws if the canvas isn't set", () => {
            const store = createStore().notefield;
            store.canvas = undefined;

            assert.throws(() => store.updateWidth());
        });

        it("updates the canvas and internal width", () => {
            const store = createStore();
            const colWidth = 32;
            const expected = colWidth * store.notefield.chart.keyCount.value;

            store.editor.data.columnWidth = colWidth;
            store.notefield.updateWidth();

            assert.strictEqual(store.notefield.canvas?.width, expected);
            assert.strictEqual(store.notefield.data.width, expected);
        });

        it("doesn't set the width if it hasn't changed", () => {
            const store = createStore().notefield;
            store.canvas!.width = 0;

            const spy = sinon.spy(store.canvas!, "width", ["set"]);

            store.updateWidth();
            store.updateWidth();

            assert(spy.set.calledOnce);
        });
    });
});
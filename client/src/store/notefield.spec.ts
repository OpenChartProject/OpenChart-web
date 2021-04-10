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
});

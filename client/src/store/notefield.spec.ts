import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { Beat, Chart, Time } from "../charting";
import { createStore } from "../testUtil";

import { NotefieldData, ZOOM_MAX, ZOOM_MIN } from "./notefield";
import { NotefieldDisplayData } from "./notefieldDisplay";

describe("NotefieldStore", () => {
    describe("#pixelsPerSecond", () => {
        it("returns expected value for 1:1 scaling", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NotefieldData> = {
                zoom: new Fraction(1),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(store.noteField.pixelsPerSecond, 100);
        });

        it("returns expected value for 2:1 scaling", () => {
            const config: Partial<NotefieldDisplayData> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NotefieldData> = {
                zoom: new Fraction(2),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(store.noteField.pixelsPerSecond, 200);
        });
    });

    describe("#scrollBy", () => {
        it("throws if both beat and time are not set");
        it("scrolls by the beat amount");
        it("scrolls by the time amount");
        it("sets scroll to 0 if beat would go negative");
        it("sets scroll to 0 if time would go negative");
    });

    describe("#setCanvas", () => {
        it("sets the canvas element and updates the width", () => {
            const el = document.createElement("canvas");
            el.width = 123;

            const store = createStore().noteField;

            store.setCanvas(el as HTMLCanvasElement);
            assert.strictEqual(store.canvas, el);
            assert.strictEqual(store.canvas.width, store.data.width);
        });
    });

    describe("#setChart", () => {
        it("sets the chart", () => {
            const store = createStore().noteField;
            const chart = new Chart();

            store.setChart(chart);
            assert.strictEqual(chart, store.chart);
        });

        it("resets the view", () => {
            const store = createStore().noteField;
            const spy = sinon.spy(store, "resetView");

            store.setChart(store.chart);

            assert(spy.called);
        });
    });

    describe("#setScroll", () => {
        it("throws if both beat and time are not set", () => {
            const store = createStore().noteField;
            assert.throws(() => store.setScroll({}));
        });

        it("sets scroll using beat", () => {
            const store = createStore().noteField;
            const chart = new Chart();
            store.setChart(chart);

            const beat = new Beat(1.5);
            const time = chart.bpms.timeAt(beat);

            store.setScroll({ beat });

            assert.deepStrictEqual(store.data.scroll, { beat, time });
        });

        it("sets scroll using time", () => {
            const store = createStore().noteField;
            const chart = new Chart();
            store.setChart(chart);

            const time = new Time(1.5);
            const beat = chart.bpms.beatAt(time);

            store.setScroll({ beat });

            assert.deepStrictEqual(store.data.scroll, { beat, time });
        });
    });

    describe("#setZoom", () => {
        it("throws if zoom is <= 0", () => {
            const store = createStore().noteField;
            assert.throws(() => store.setZoom(new Fraction(0)));
            assert.throws(() => store.setZoom(new Fraction(-1)));
        });

        it("sets zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(1, 2);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, val);
        });

        it("sets zoom to min zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(1, 9999999);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, ZOOM_MIN);
        });

        it("sets zoom to max zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(9999999);

            store.setZoom(val);
            assert.strictEqual(store.data.zoom, ZOOM_MAX);
        });

        it("doesn't set the zoom if it's already the same");
    });
});

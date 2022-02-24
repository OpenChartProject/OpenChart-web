import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { Beat, Chart, Time } from "../charting";
import { createStore } from "../test";

import { ZOOM_MAX, ZOOM_MIN } from "./notefield";
import { ScrollDirection } from "./notefieldDisplay";

describe("NotefieldStore", () => {
    describe("new", () => {
        it("creates a default chart", () => {
            const store = createStore().notefield;
            assert.deepStrictEqual(store.data.chart, new Chart());
        });

        it("creates the autoscroll controller", () => {
            const store = createStore();
            assert(store.notefield.autoScroller);
        });
    });

    describe("#pixelsPerSecond", () => {
        it("returns expected value for 1:1 scaling", () => {
            const store = createStore();
            store.notefieldDisplay.data.pixelsPerSecond = 100;
            store.notefield.data.zoom = new Fraction(1);

            assert.deepStrictEqual(store.notefield.pixelsPerSecond, 100);
        });

        it("returns expected value for 2:1 scaling", () => {
            const store = createStore();
            store.notefieldDisplay.data.pixelsPerSecond = 100;
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
            assert.strictEqual(chart, store.data.chart);
        });

        it("resets the view", () => {
            const store = createStore().notefield;
            const spy = sinon.spy(store, "resetView");

            store.setChart(store.data.chart);

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

        it("calls the expected functions when play starts", () => {
            const { notefield, ui } = createStore();
            const stubs = {
                autoScroller: sinon.stub(notefield.autoScroller, "start"),
                metronome: ui.controllers.metronome.start as sinon.SinonStub,
                music: sinon.stub(ui.controllers.music),
            };

            notefield.setPlaying(true);

            assert(stubs.autoScroller.calledOnce);
            assert(stubs.metronome.calledOnce);
            assert(stubs.music.seek.calledOnceWith(notefield.data.scroll.time.value));
            assert(stubs.music.play.calledOnce);
        });

        it("calls the expected functions when play stops", () => {
            const { notefield, ui } = createStore();
            const stubs = {
                metronome: ui.controllers.metronome.stop as sinon.SinonStub,
                music: sinon.stub(ui.controllers.music, "pause"),
            };

            notefield.setPlaying(true);
            notefield.setPlaying(false);

            assert(stubs.metronome.calledOnce);
            assert(stubs.music.calledOnce);
        });

        it("doesn't call play functions if already playing", () => {
            const { notefield, ui } = createStore();
            const stubs = {
                autoScroller: sinon.stub(notefield.autoScroller, "start"),
                metronome: ui.controllers.metronome.start as sinon.SinonStub,
                music: sinon.stub(ui.controllers.music),
            };

            notefield.data.isPlaying = true;
            notefield.setPlaying(true);

            assert(stubs.autoScroller.notCalled);
            assert(stubs.metronome.notCalled);
            assert(stubs.music.seek.notCalled);
            assert(stubs.music.play.notCalled);
        });

        it("doesn't call pause/stop functions if already paused", () => {
            const { notefield, ui } = createStore();
            const stubs = {
                metronome: ui.controllers.metronome.stop as sinon.SinonStub,
                music: sinon.stub(ui.controllers.music, "pause"),
            };

            notefield.data.isPlaying = false;
            notefield.setPlaying(false);

            assert(stubs.metronome.notCalled);
            assert(stubs.music.notCalled);
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
            const time = store.data.chart.bpms.timeAt(beat);

            store.setScroll({ beat });

            assert.deepStrictEqual(store.data.scroll, { beat, time });
        });

        it("sets scroll using time", () => {
            const store = createStore().notefield;

            const time = new Time(1.5);
            const beat = store.data.chart.bpms.beatAt(time);

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

    describe("#timeToNotefieldPosition", () => {
        interface TestCase {
            time: number;
            scroll?: number;
            expected: number;
            when: string;
        }

        const store = createStore().notefield;
        const cases: TestCase[] = [
            {
                time: 0,
                expected: 0,
                when: "time is 0",
            },
            {
                time: 1,
                expected: store.pixelsPerSecond,
                when: "time is 1",
            },
            {
                time: 2.34,
                expected: 2.34 * store.pixelsPerSecond,
                when: "time is 2.34",
            },
            {
                scroll: 2,

                time: 1,
                expected: store.pixelsPerSecond,
                when: "time is 1 but scrolled",
            },
        ];

        cases.forEach((c) => {
            it(`returns expected value when ${c.when}`, () => {
                store.setScroll({ time: new Time(c.scroll ?? 0) });
                assert.strictEqual(store.timeToNotefieldPosition(c.time), c.expected);
            });
        });
    });

    describe("#timeToScreenPosition", () => {
        interface TestCase {
            time: number;
            scroll: number;
            scrollDirection: ScrollDirection;
            receptorY: number;
            expected: number;
            when: string;
        }

        const store = createStore();
        store.notefield.setCanvas(document.createElement("canvas"));

        const height = 500;
        store.notefield.setHeight(height);

        const cases: TestCase[] = [
            {
                scroll: 0,
                scrollDirection: "up",
                receptorY: 0,

                time: 0,
                expected: 0,
                when: "everything is 0",
            },
            {
                scroll: 0,
                scrollDirection: "down",
                receptorY: 0,

                time: 0,
                expected: height,
                when: "everything is 0 (downscroll)",
            },
            {
                scroll: 2,
                scrollDirection: "up",
                receptorY: 0,

                expected: -2 * store.notefield.pixelsPerSecond,
                time: 0,
                when: "time is 0 (scrolled)",
            },
            {
                scroll: 2,
                scrollDirection: "down",
                receptorY: 0,

                time: 0,
                expected: 2 * store.notefield.pixelsPerSecond + height,
                when: "time is 0 (scrolled, downscroll)",
            },
            {
                scroll: 0,
                scrollDirection: "up",
                receptorY: 0,

                time: 1,
                expected: store.notefield.pixelsPerSecond,
                when: "time is 1",
            },
            {
                scroll: 2,
                scrollDirection: "up",
                receptorY: 0,

                time: 1,
                expected: -1 * store.notefield.pixelsPerSecond,
                when: "time is 1 (scrolled)",
            },
            {
                scroll: 2,
                scrollDirection: "down",
                receptorY: 0,

                time: 1,
                expected: store.notefield.pixelsPerSecond + height,
                when: "time is 1 (scrolled, downscroll)",
            },
            {
                scroll: 0,
                scrollDirection: "up",
                receptorY: 100,

                time: 0,
                expected: 100,
                when: "receptor Y is set",
            },
            {
                scroll: 0,
                scrollDirection: "down",
                receptorY: 100,

                time: 0,
                expected: height - 100,
                when: "receptor Y is set (downscroll)",
            },
        ];

        cases.forEach((c) => {
            it(`returns expected value when ${c.when}`, () => {
                store.notefield.setScroll({ time: new Time(c.scroll ?? 0) });
                store.notefieldDisplay.data.scrollDirection = c.scrollDirection;
                store.notefieldDisplay.data.receptorY = c.receptorY;

                assert.strictEqual(store.notefield.timeToScreenPosition(c.time), c.expected);
            });
        });
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
            const expected = colWidth * store.notefield.data.chart.keyCount.value;

            store.notefieldDisplay.data.columnWidth = colWidth;
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

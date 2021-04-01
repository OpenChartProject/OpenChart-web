import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";

import { Beat, Time } from "../charting/";
import { Baseline, EditorConfig, NoteFieldState } from "../store";
import { createStore } from "../testUtil";

import {
    adjustToBaseline,
    calculateViewport,
    DrawProps,
    pps,
    scaleToWidth,
    timeToPosition,
} from "./drawing";

describe("notefield", () => {
    describe("#adjustToBaseline", () => {
        it("returns expected value when baseline is After", () => {
            const store = createStore();
            store.editor.config.baseline = Baseline.After;
            const dp: Partial<DrawProps> = { editor: store.editor };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 0);
        });

        it("returns expected value when baseline is Before and is upscroll", () => {
            const store = createStore();
            store.editor.config.baseline = Baseline.Before;
            const dp: Partial<DrawProps> = { editor: store.editor };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), -50);
        });

        it("returns expected value when baseline is Before and is downscroll", () => {
            const store = createStore();
            store.editor.config.baseline = Baseline.Before;
            store.editor.config.scrollDirection = "down";
            const dp: Partial<DrawProps> = { editor: store.editor };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 50);
        });

        it("returns expected value when baseline is Centered and is upscroll", () => {
            const store = createStore();
            store.editor.config.baseline = Baseline.Centered;
            const dp: Partial<DrawProps> = { editor: store.editor };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), -25);
        });

        it("returns expected value when baseline is Centered and is downscroll", () => {
            const store = createStore();
            store.editor.config.baseline = Baseline.Centered;
            store.editor.config.scrollDirection = "down";
            const dp: Partial<DrawProps> = { editor: store.editor };
            assert.strictEqual(adjustToBaseline(dp as DrawProps, 0, 50), 25);
        });
    });

    describe("#calculateViewport", () => {
        it("returns expected value when scroll and margin are 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is > 1 and margin is 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(2),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2.5);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is < 1 and margin is 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1, 2),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 10);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is > 1 and margin is > 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(2),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 2);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when zoom is < 1 and margin is > 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1, 2),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 8);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is 0 and margin is > 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state: Partial<NoteFieldState> = {
                scroll: {
                    beat: Beat.Zero,
                    time: Time.Zero,
                },
                zoom: new Fraction(1),
            };

            const store = createStore({ config, state });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, -100);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 4);
            assert.strictEqual(tReceptor.value, 0);
        });

        it("returns expected value when scroll is > 0 and margin is 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 0,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(1),
            };

            const store = createStore({ config, state });
            store.noteField.setScroll({ time: new Time(1) });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, 100);
            assert.strictEqual(t0.value, 1);
            assert.strictEqual(t1.value, 6);
            assert.strictEqual(tReceptor.value, 1);
        });

        it("returns expected value when scroll is > 0 and margin is > 0", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
                margin: 100,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(1),
            };

            const store = createStore({ config, state });
            store.noteField.setScroll({ time: new Time(1) });
            sinon.stub(store.noteField.canvas!, "clientHeight").value(500);

            const { y0, t0, t1, tReceptor } = calculateViewport(store.editor, store.noteField);

            assert.strictEqual(y0, 0);
            assert.strictEqual(t0.value, 0);
            assert.strictEqual(t1.value, 5);
            assert.strictEqual(tReceptor.value, 1);
        });
    });

    describe("#pps", () => {
        it("returns expected value for 1:1 scaling", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(1),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(pps(store.editor, store.noteField), 100);
        });

        it("returns expected value for 2:1 scaling", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(2),
            };
            const store = createStore({ config, state });

            assert.deepStrictEqual(pps(store.editor, store.noteField), 200);
        });
    });

    describe("#scaleToWidth", () => {
        it("returns expected value for 1:1 scaling", () => {
            assert.strictEqual(scaleToWidth(2, 4, 2), 4);
        });

        it("returns expected value for downscaling", () => {
            assert.strictEqual(scaleToWidth(4, 4, 2), 2);
        });

        it("returns expected value for upscaling", () => {
            assert.strictEqual(scaleToWidth(2, 2, 4), 4);
        });
    });

    describe("#timeToPosition", () => {
        it("returns expected value", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(1),
            };
            const store = createStore({ config, state });
            const dp: Partial<DrawProps> = { editor: store.editor, noteField: store.noteField };

            assert.strictEqual(timeToPosition(dp as DrawProps, 0), 0);
            assert.strictEqual(
                timeToPosition(dp as DrawProps, 1),
                store.editor.config.pixelsPerSecond,
            );
            assert.strictEqual(
                timeToPosition(dp as DrawProps, 2),
                2 * store.editor.config.pixelsPerSecond,
            );
        });

        it("rounds to the nearest whole number", () => {
            const config: Partial<EditorConfig> = {
                pixelsPerSecond: 100,
            };
            const state: Partial<NoteFieldState> = {
                zoom: new Fraction(1.5),
            };
            const store = createStore({ config, state });
            const dp: Partial<DrawProps> = { editor: store.editor, noteField: store.noteField };

            assert.strictEqual(timeToPosition(dp as DrawProps, 0.55), 83);
        });
    });
});

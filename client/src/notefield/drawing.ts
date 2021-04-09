import { Chart, Time, toTime } from "../charting/";
import { ChartObject } from "../charting/objects/";
import { NoteSkin } from "../noteskin";
import { Baseline, NotefieldDisplayStore, NoteFieldStore, RootStore } from "../store";

import { getBeatLineTimes } from "./beatlines";

/**
 * Stores some useful values used for rendering.
 */
export interface Viewport {
    /**
     * The scroll position, in pixels. This is the y-pos with respect to the canvas origin.
     */
    y0: number;

    /**
     * The time at the top of the viewport.
     */
    t0: Time;

    /**
     * The time at the bottom of the viewport.
     */
    t1: Time;

    /**
     * The time at the receptors.
     */
    tReceptor: Time;
}

export interface DrawProps extends Viewport {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    chart: Chart;
    noteSkin: NoteSkin;
    editor: NotefieldDisplayStore;
    noteField: NoteFieldStore;
}

/**
 * Returns the new position of the object after taking the baseline into account.
 */
export function adjustToBaseline(dp: DrawProps, pos: number, h: number): number {
    const { data } = dp.editor;

    switch (data.baseline) {
        case Baseline.After:
            return pos;
        case Baseline.Before:
            if (data.scrollDirection === "up") {
                return pos - h;
            } else {
                return pos + h;
            }
        case Baseline.Centered:
            if (data.scrollDirection === "up") {
                return pos - h / 2;
            } else {
                return pos + h / 2;
            }
    }
}

/**
 * This calculates both the scroll position of the viewport as well as the boundaries
 * for what should be rendered.
 *
 * The term "viewport" in this context is just a concept, it's not a physical object.
 * The objects on the notefield are rendered with respect to the canvas origin, not
 * with respect to the scrolling.
 */
export function calculateViewport(
    editor: NotefieldDisplayStore,
    noteField: NoteFieldStore,
): Viewport {
    const y0 = noteField.data.scroll.time.value * noteField.pixelsPerSecond - editor.data.receptorY;
    const t0 = new Time(Math.max(y0 / noteField.pixelsPerSecond, 0));
    const t1 = new Time(Math.max((y0 + noteField.data.height) / noteField.pixelsPerSecond, 0));
    const tReceptor = noteField.data.scroll.time;

    return { y0, t0, t1, tReceptor };
}

/**
 * Returns the new height after scaling to fit a particular width.
 */
export function scaleToWidth(srcW: number, srcH: number, dstW: number): number {
    return (dstW / srcW) * srcH;
}

/**
 * Converts time to position.
 */
export function timeToPosition({ editor, noteField }: DrawProps, time: Time | number): number {
    return Math.round(toTime(time).value * noteField.pixelsPerSecond);
}

function clear(dp: DrawProps) {
    const { ctx, w, h } = dp;

    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, w, h);
    ctx.restore();
}

function drawBeatLines(dp: DrawProps) {
    const { ctx, w, t0, t1, chart } = dp;
    const { data: editor } = dp.editor;
    const { data: noteField } = dp.noteField;

    for (const bt of getBeatLineTimes(chart, noteField.snap, t0, t1)) {
        if (bt.beat.isStartOfMeasure()) {
            ctx.strokeStyle = editor.beatLines.measureLines.color;
            ctx.lineWidth = editor.beatLines.measureLines.lineWidth;
        } else if (bt.beat.isWholeBeat()) {
            ctx.strokeStyle = editor.beatLines.wholeBeatLines.color;
            ctx.lineWidth = editor.beatLines.wholeBeatLines.lineWidth;
        } else {
            ctx.strokeStyle = editor.beatLines.fractionalLines.color;
            ctx.lineWidth = editor.beatLines.fractionalLines.lineWidth;
        }

        let y = timeToPosition(dp, bt.time);

        if (ctx.lineWidth % 2 === 1) {
            y += 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.closePath();
        ctx.stroke();
    }
}

function drawReceptor(dp: DrawProps, key: number) {
    const { ctx, editor, noteField, noteSkin, tReceptor } = dp;
    const { data } = editor;

    const r = noteSkin.receptor[key];
    const h = scaleToWidth(r.width as number, r.height as number, data.columnWidth);
    const y = adjustToBaseline(dp, tReceptor.value * noteField.pixelsPerSecond, h);

    ctx.save();
    ctx.translate(0, y);

    if (data.scrollDirection === "down") {
        ctx.scale(1, -1);
    }

    ctx.drawImage(r, key * data.columnWidth, 0, data.columnWidth, h);
    ctx.restore();
}

function drawReceptors(dp: DrawProps) {
    const { ctx, chart } = dp;

    for (let i = 0; i < chart.keyCount.value; i++) {
        ctx.save();
        drawReceptor(dp, i);
        ctx.restore();
    }
}

function drawTap(dp: DrawProps, key: number, obj: ChartObject) {
    const { ctx, chart, noteSkin } = dp;
    const { data } = dp.editor;

    const img = noteSkin.tap[key];
    const h = scaleToWidth(img.width as number, img.height as number, data.columnWidth);

    // TODO: Add time property to ChartObject
    const t = chart.bpms.timeAt(obj.beat);
    const y = adjustToBaseline(dp, timeToPosition(dp, t), h);

    ctx.translate(0, y);

    if (data.scrollDirection === "down") {
        ctx.scale(1, -1);
    }

    ctx.drawImage(img, 0, 0, data.columnWidth, h);
}

function drawObjects(dp: DrawProps) {
    const { ctx, t0, t1, chart } = dp;
    const { data } = dp.editor;

    for (let i = 0; i < chart.keyCount.value; i++) {
        const objects = chart.getObjectsInInterval(
            i,
            // Extend the interval a bit to prevent notes at the edge of the screen from
            // getting cut off
            Math.max(t0.value - 2, 0),
            t1.value + 2,
        );

        ctx.save();

        // Move to the correct column.
        ctx.translate(i * data.columnWidth, 0);

        for (const obj of objects) {
            ctx.save();

            if (obj.type === "tap") {
                drawTap(dp, i, obj);
            }

            ctx.restore();
        }

        ctx.restore();
    }
}

export function drawNoteField(store: RootStore) {
    const { editor, noteField } = store;

    if (!noteField.canvas || !editor.data.noteSkin) {
        return;
    }

    const ctx = noteField.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.save();

    const viewport = calculateViewport(editor, noteField);
    const drawProps = {
        ctx,
        w: noteField.data.width,
        h: noteField.data.height,
        chart: noteField.chart,
        noteSkin: editor.data.noteSkin,
        editor,
        noteField,
        ...viewport,
    };

    // This mirrors the notefield vertically, so now the canvas origin is in the bottom
    // left corner instead of the top left corner.
    if (editor.data.scrollDirection === "down") {
        ctx.translate(0, drawProps.h);
        ctx.scale(1, -1);
    }

    // Move the viewport to the current scroll position.
    ctx.translate(0, -viewport.y0);

    clear(drawProps);
    drawBeatLines(drawProps);
    drawReceptors(drawProps);
    drawObjects(drawProps);

    ctx.restore();
}

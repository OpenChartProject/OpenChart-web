import { Chart } from "../../charting/";
import { ChartObject } from "../../charting/objects/";
import { NoteSkin } from "../../noteskin";
import { BeatLineStyle, NotefieldDisplayStore, NotefieldStore, RootStore } from "../../store";
import { getBeatLineTimes } from "../beatlines";

import { adjustToBaseline, scaleToWidth, timeToPosition } from "./util";
import { calculateViewport, Viewport } from "./viewport";

export interface DrawProps extends Viewport {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    chart: Chart;
    noteSkin: NoteSkin;
    notefieldDisplay: NotefieldDisplayStore;
    notefield: NotefieldStore;
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
    const { data: notefieldDisplay } = dp.notefieldDisplay;
    const { data: notefield } = dp.notefield;

    const lines = {
        measure: [] as number[],
        beat: [] as number[],
        fractional: [] as number[],
    };

    for (const bt of getBeatLineTimes(chart, notefield.snap, t0, t1)) {
        let y = timeToPosition(dp.notefield, bt.time);

        if (ctx.lineWidth % 2 === 1) {
            y += 0.5;
        }

        if (bt.beat.isStartOfMeasure()) {
            lines.measure.push(y);
        } else if (bt.beat.isWholeBeat()) {
            lines.beat.push(y);
        } else {
            lines.fractional.push(y);
        }
    }

    const drawLines = (yPositions: number[], { color, lineWidth }: BeatLineStyle) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();

        for (const y of yPositions) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }

        ctx.closePath();
        ctx.stroke();
    };

    drawLines(lines.measure, notefieldDisplay.beatLines.measureLines);
    drawLines(lines.beat, notefieldDisplay.beatLines.wholeBeatLines);
    drawLines(lines.fractional, notefieldDisplay.beatLines.fractionalLines);
}

function drawReceptor(dp: DrawProps, key: number) {
    const { ctx, notefieldDisplay, notefield, noteSkin, tReceptor } = dp;
    const { data } = notefieldDisplay;

    const r = noteSkin.receptor[key];
    const h = scaleToWidth(r.width as number, r.height as number, data.columnWidth);
    const y = adjustToBaseline(notefieldDisplay, tReceptor.value * notefield.pixelsPerSecond, h);

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
    const { data } = dp.notefieldDisplay;

    const img = noteSkin.tap[key];
    const h = scaleToWidth(img.width as number, img.height as number, data.columnWidth);

    // TODO: Add time property to ChartObject
    const t = chart.bpms.timeAt(obj.beat);
    const y = adjustToBaseline(dp.notefieldDisplay, timeToPosition(dp.notefield, t), h);

    ctx.translate(0, y);

    if (data.scrollDirection === "down") {
        ctx.scale(1, -1);
    }

    ctx.drawImage(img, 0, 0, data.columnWidth, h);
}

function drawObjects(dp: DrawProps) {
    const { ctx, t0, t1, chart } = dp;
    const { data } = dp.notefieldDisplay;

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

export function drawNotefield(store: RootStore) {
    const { notefieldDisplay, notefield } = store;

    if (!notefield.canvas || !notefieldDisplay.data.noteSkin) {
        return;
    }

    const ctx = notefield.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.save();

    const viewport = calculateViewport(notefieldDisplay, notefield);
    const drawProps = {
        ctx,
        w: notefield.data.width,
        h: notefield.data.height,
        chart: notefield.data.chart,
        noteSkin: notefieldDisplay.data.noteSkin,
        notefieldDisplay,
        notefield,
        ...viewport,
    };

    // This mirrors the notefield vertically, so now the canvas origin is in the bottom
    // left corner instead of the top left corner.
    if (notefieldDisplay.data.scrollDirection === "down") {
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

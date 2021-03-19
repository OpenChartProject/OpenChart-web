import { getBeatLineTimes } from "./beatlines";
import { Time } from "../charting/time";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./config";
import { KeyIndex } from "../charting/keyIndex";
import { ChartObject } from "../charting/objects/chartObject";

export type DrawConfig = NoteFieldConfig & NoteFieldState;

export interface DrawProps {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    config: DrawConfig;
    t0: Time;
    t1: Time;
}

/**
 * Returns the new position of the object after taking the baseline into account.
 */
export function adjustToBaseline(
    { config }: DrawProps,
    pos: number,
    h: number,
): number {
    switch (config.baseline) {
        case Baseline.After:
            return pos;
        case Baseline.Before:
            return pos - h;
        case Baseline.Centered:
            return pos - h / 2;
    }
}

/**
 * Returns the new height after scaling to fit a particular width.
 */
export function scaleToWidth(srcW: number, srcH: number, dstW: number): number {
    return (dstW / srcW) * srcH;
}

/**
 * Returns the position of an object with respect to the current scroll position.
 */
export function timeToPosition({ config, t0 }: DrawProps, time: Time): number {
    return (time.value - t0.value) * config.pixelsPerSecond;
}

function clear(dp: DrawProps) {
    const { ctx, w, h, config } = dp;

    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);
}

function drawBeatLines(dp: DrawProps) {
    const { ctx, w, config, t0, t1 } = dp;

    for (const bt of getBeatLineTimes(config.chart, t0, t1)) {
        if (bt.beat.isStartOfMeasure()) {
            ctx.strokeStyle = config.beatLines.measureLines.color;
            ctx.lineWidth = config.beatLines.measureLines.lineWidth;
        } else {
            ctx.strokeStyle = config.beatLines.nonMeasureLines.color;
            ctx.lineWidth = config.beatLines.nonMeasureLines.lineWidth;
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

function drawReceptors(dp: DrawProps) {
    const { ctx, config } = dp;

    for (let i = 0; i < config.keyCount; i++) {
        const r = config.noteSkin.receptor[i];
        const h = scaleToWidth(
            r.width as number,
            r.height as number,
            config.columnWidth,
        );
        const y = adjustToBaseline(dp, 0, h);

        ctx.drawImage(r, i * config.columnWidth, y, config.columnWidth, h);
    }
}

function drawTap(dp: DrawProps, key: number, obj: ChartObject) {
    const { ctx, config } = dp;

    const img = config.noteSkin.tap[key];
    const h = scaleToWidth(
        img.width as number,
        img.height as number,
        config.columnWidth,
    );

    // TODO: Add time property to ChartObject
    const t = config.chart.bpms.timeAt(obj.beat);
    const y = adjustToBaseline(dp, timeToPosition(dp, t), h);

    ctx.drawImage(img, 0, y, config.columnWidth, h);
}

function drawObjects(dp: DrawProps) {
    const { ctx, config, t0, t1 } = dp;

    for (let i = 0; i < config.keyCount; i++) {
        const objects = config.chart.getObjectsInInterval(
            new KeyIndex(i),
            // Extend the interval a bit to prevent notes at the edge of the screen from
            // getting cut off
            new Time(Math.max(t0.value - 2, 0)),
            new Time(t1.value + 2),
        );

        ctx.save();

        // Move to the correct column.
        ctx.translate(i * config.columnWidth, 0);

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

export function drawNoteField(el: HTMLCanvasElement, config: DrawConfig) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    const { width: w, height: h } = el;

    if (h === 0) return;

    const t0 = new Time(config.scroll * config.secondsPerScrollTick);
    const t1 = new Time(t0.value + h / config.pixelsPerSecond);

    const drawProps = { ctx, w, h, config, t0, t1 };

    clear(drawProps);
    drawBeatLines(drawProps);
    drawReceptors(drawProps);
    drawObjects(drawProps);
}

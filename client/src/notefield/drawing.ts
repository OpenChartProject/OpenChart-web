import { getBeatLineTimes } from "./beatlines";
import { Time } from "../charting/time";
import { Baseline, NoteFieldConfig, NoteFieldState } from "./config";
import { ChartObject } from "../charting/objects/chartObject";
import { toTime } from "../charting/util";

/**
 * Stores some useful values used for rendering.
 */
interface Viewport {
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

interface DrawProps extends Viewport {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    config: NoteFieldConfig;
    state: NoteFieldState;
}

/**
 * Returns the pixels per second, taking into account the scaling.
 */
export function pps(config: NoteFieldConfig, state: NoteFieldState): number {
    return config.pixelsPerSecond * state.zoom.valueOf();
}

/**
 * Returns the new position of the object after taking the baseline into account.
 */
export function adjustToBaseline({ config }: DrawProps, pos: number, h: number): number {
    switch (config.baseline) {
        case Baseline.After:
            return pos;
        case Baseline.Before:
            if (config.scrollDirection === "up") {
                return pos - h;
            } else {
                return pos + h;
            }
        case Baseline.Centered:
            if (config.scrollDirection === "up") {
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
export function calculateViewport(config: NoteFieldConfig, state: NoteFieldState): Viewport {
    const y0 = state.scroll.time.value * pps(config, state) - config.margin;
    const t0 = new Time(Math.max(y0 / pps(config, state), 0));
    const t1 = new Time(Math.max((y0 + state.height) / pps(config, state), 0));
    const tReceptor = state.scroll.time;

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
export function timeToPosition({ config, state }: DrawProps, time: Time | number): number {
    return Math.round(toTime(time).value * pps(config, state));
}

function clear(dp: DrawProps) {
    const { ctx, w, h, config } = dp;

    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

function drawBeatLines(dp: DrawProps) {
    const { ctx, w, config, state, t0, t1 } = dp;

    for (const bt of getBeatLineTimes(config.chart, state.snap, t0, t1)) {
        if (bt.beat.isStartOfMeasure()) {
            ctx.strokeStyle = config.beatLines.measureLines.color;
            ctx.lineWidth = config.beatLines.measureLines.lineWidth;
        } else if (bt.beat.isWholeBeat()) {
            ctx.strokeStyle = config.beatLines.wholeBeatLines.color;
            ctx.lineWidth = config.beatLines.wholeBeatLines.lineWidth;
        } else {
            ctx.strokeStyle = config.beatLines.fractionalLines.color;
            ctx.lineWidth = config.beatLines.fractionalLines.lineWidth;
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
    const { ctx, config, state, tReceptor } = dp;

    const r = config.noteSkin.receptor[key];
    const h = scaleToWidth(r.width as number, r.height as number, config.columnWidth);
    const y = adjustToBaseline(dp, tReceptor.value * pps(config, state), h);

    ctx.save();
    ctx.translate(0, y);

    if (config.scrollDirection === "down") {
        ctx.scale(1, -1);
    }

    ctx.drawImage(r, key * config.columnWidth, 0, config.columnWidth, h);
    ctx.restore();
}

function drawReceptors(dp: DrawProps) {
    const { ctx, config } = dp;

    for (let i = 0; i < config.keyCount; i++) {
        ctx.save();
        drawReceptor(dp, i);
        ctx.restore();
    }
}

function drawTap(dp: DrawProps, key: number, obj: ChartObject) {
    const { ctx, config } = dp;

    const img = config.noteSkin.tap[key];
    const h = scaleToWidth(img.width as number, img.height as number, config.columnWidth);

    // TODO: Add time property to ChartObject
    const t = config.chart.bpms.timeAt(obj.beat);
    const y = adjustToBaseline(dp, timeToPosition(dp, t), h);

    ctx.translate(0, y);

    if (config.scrollDirection === "down") {
        ctx.scale(1, -1);
    }

    ctx.drawImage(img, 0, 0, config.columnWidth, h);
}

function drawObjects(dp: DrawProps) {
    const { ctx, config, t0, t1 } = dp;

    for (let i = 0; i < config.keyCount; i++) {
        const objects = config.chart.getObjectsInInterval(
            i,
            // Extend the interval a bit to prevent notes at the edge of the screen from
            // getting cut off
            Math.max(t0.value - 2, 0),
            t1.value + 2,
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

export function drawNoteField(
    el: HTMLCanvasElement,
    config: NoteFieldConfig,
    state: NoteFieldState,
) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    const { width: w, height: h } = state;

    if (h === 0) return;

    ctx.save();

    const viewport = calculateViewport(config, state);
    const drawProps = { ctx, w, h, config, state, ...viewport };

    // This mirrors the notefield vertically, so now the canvas origin is in the bottom
    // left corner instead of the top left corner.
    if (config.scrollDirection === "down") {
        ctx.translate(0, state.height);
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

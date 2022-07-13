import assert from "assert";

import { Time, toTime } from "../../charting";
import { Baseline, NotefieldDisplayStore, NotefieldStore } from "../../store";
import { NotefieldContext } from "../context";

import { KeyImage } from "./drawData";

export interface Rect {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

/**
 * Transforms an absolute Y position into the Y position that is drawn on the canvas.
 *
 * The canvas Y takes into account the receptor offset and the scroll direction.
 * If the notefield is set to upscroll and the receptor offset is 0, the absolute Y
 * and the canvas Y are the same.
 *
 * @param ctx The notefield context
 * @param y The absolute Y position
 */
export function absToCanvasY(ctx: NotefieldContext, y: number): number {
    let chartOrigin = -ctx.viewport.y0;
    let canvasY: number;

    if (ctx.notefieldDisplay.data.scrollDirection === "down") {
        chartOrigin *= -1;
        chartOrigin += ctx.h;
        canvasY = chartOrigin - y;
    } else {
        canvasY = chartOrigin + y;
    }

    return canvasY;
}

/**
 * Returns the new position of the object after taking the baseline into account.
 *
 * @param pos The position, in pixels, of the object
 * @param h The height, in pixels, of the object
 */
export function adjustToBaseline(display: NotefieldDisplayStore, pos: number, h: number): number {
    const { baseline, scrollDirection } = display.data;

    switch (baseline) {
        case Baseline.After:
            return pos;
        case Baseline.Before:
            if (scrollDirection === "up") {
                return pos - h;
            } else {
                return pos + h;
            }
        case Baseline.Centered:
            if (scrollDirection === "up") {
                return pos - h / 2;
            } else {
                return pos + h / 2;
            }
    }
}

/**
 * Returns the bounding rect of a key image on the Notefield canvas. In other words, the
 * size and position of something like a tap note on the user's screen.
 */
export function getKeyImageBoundingBox(
    ki: KeyImage,
    notefield: NotefieldStore,
    display: NotefieldDisplayStore,
): Rect {
    assert(notefield.canvas, "Canvas is undefined");
    assert(notefield.ctx, "Notefield context is undefined");

    const canvasRect = notefield.canvas.getBoundingClientRect();
    const canvasY = absToCanvasY(notefield.ctx, ki.absY);

    // Calculate the bounding box of the tap note
    const rect: Rect = {
        x0: canvasRect.left + ki.key * display.data.columnWidth,
        y0: canvasY,
        x1: canvasRect.left + (ki.key + 1) * display.data.columnWidth,
        y1: canvasY + ki.h,
    };

    return rect;
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
export function timeToPosition(notefield: NotefieldStore, time: Time | number): number {
    return Math.round(toTime(time).value * notefield.pixelsPerSecond);
}

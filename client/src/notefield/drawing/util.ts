import { Time, toTime } from "../../charting";
import { Baseline, NotefieldDisplayStore, NotefieldStore } from "../../store";

/**
 * Returns the new position of the object after taking the baseline into account.
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

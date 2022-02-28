import { ChartObject } from "../../charting/objects";
import { NoteSkinImage } from "../../noteskin";
import { getBeatLineTimes } from "../beatlines";
import { NotefieldContext } from "../context";
import { adjustToBaseline, scaleToWidth, timeToPosition } from "./util";

export interface KeyImage {
    img: NoteSkinImage;
    key: number;
    h: number;
    y: number;
}

export interface BeatLines {
    beat: number[];
    measure: number[];
    snap: number[];
}

export type Receptor = KeyImage;
export type Tap = KeyImage;

export interface ChartObjects {
    taps: Tap[];
}

export interface NotefieldDrawData {
    beatLines: BeatLines;
    receptors: Receptor[];
    objects: ChartObjects;
}

export function getBeatLines(ctx: NotefieldContext): BeatLines {
    const pos: BeatLines = {
        beat: [],
        measure: [],
        snap: [],
    };

    const beatTimes = getBeatLineTimes(ctx.chart, ctx.notefield.data.snap, ctx.viewport.t0, ctx.viewport.t1);

    for (const bt of beatTimes) {
        let y = timeToPosition(ctx.notefield, bt.time);

        if (bt.beat.isStartOfMeasure()) {
            pos.measure.push(y);
        } else if (bt.beat.isWholeBeat()) {
            pos.beat.push(y);
        } else {
            pos.snap.push(y);
        }
    }

    return pos;
}

export function getReceptors(ctx: NotefieldContext): Receptor[] {
    const receptors: Receptor[] = [];

    for (let key = 0; key < ctx.chart.keyCount.value; key++) {
        const img = ctx.noteSkin.receptor[key];
        const h = scaleToWidth(img.width as number, img.height as number, ctx.notefieldDisplay.data.columnWidth);
        const y = adjustToBaseline(ctx.notefieldDisplay, ctx.viewport.tReceptor.value * ctx.notefield.pixelsPerSecond, h);

        receptors.push({
            img, key, h, y
        });
    }

    return receptors;
}

export function getTap(ctx: NotefieldContext, key: number, obj: ChartObject): Tap {
    const img = ctx.noteSkin.tap[key];
    const h = scaleToWidth(img.width as number, img.height as number, ctx.notefieldDisplay.data.columnWidth);

    // TODO: Add time property to ChartObject
    const t = ctx.chart.bpms.timeAt(obj.beat);
    const y = adjustToBaseline(ctx.notefieldDisplay, timeToPosition(ctx.notefield, t), h);

    return { img, key, h, y };
}

export function getChartObjects(ctx: NotefieldContext): ChartObjects {
    const objects: ChartObjects = {
        taps: [],
    };

    for (let key = 0; key < ctx.chart.keyCount.value; key++) {
        const keyObjects = ctx.chart.getObjectsInInterval(
            key,
            // Extend the interval a bit to prevent notes at the edge of the screen from
            // getting cut off
            Math.max(ctx.viewport.t0.value - 2, 0),
            ctx.viewport.t1.value + 2,
        );

        for (const obj of keyObjects) {
            if (obj.type === "tap") {
                objects.taps.push(getTap(ctx, key, obj));
            }
        }
    }

    return objects;
}

export function getNotefieldDrawData(ctx: NotefieldContext): NotefieldDrawData {
    return {
        beatLines: getBeatLines(ctx),
        receptors: getReceptors(ctx),
        objects: getChartObjects(ctx),
    };
}

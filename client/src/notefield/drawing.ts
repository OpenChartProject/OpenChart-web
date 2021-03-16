import { getBeatLineTimes } from "./beatlines";
import { Time } from "../charting/time";
import { NoteFieldConfig, NoteFieldState } from "./config";

type DrawConfig = NoteFieldConfig & NoteFieldState;

interface DrawProps {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    config: DrawConfig;
    t0: Time;
    t1: Time;
}

function clear({ ctx, w, h, config }: DrawProps) {
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);
}

function drawBeatLines({ ctx, w, h, config, t0, t1 }: DrawProps) {
    ctx.strokeStyle = config.colors.beatLines;
    ctx.lineWidth = 1;

    for (const time of getBeatLineTimes(config.chart, t0, t1)) {
        let y = (time.value - t0.value) * config.pixelsPerSecond;

        if (ctx.lineWidth % 2 === 1) {
            y += 0.5;
        }

        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

function drawReceptors({ ctx, w, h, config }: DrawProps) {
    for (let i = 0; i < config.keyCount; i++) {
        ctx.drawImage(config.noteSkin.receptor[i], i * config.columnWidth, 0);
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
}

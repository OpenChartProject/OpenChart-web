import { getBeatLineTimes } from "./beatlines";
import { Time } from "../charting/time";
import { NoteFieldConfig } from "./config";

interface DrawProps {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    config: NoteFieldConfig;
}

function clear({ ctx, w, h, config }: DrawProps) {
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);
}

function drawBeatLines({ ctx, w, h, config }: DrawProps) {
    ctx.strokeStyle = config.colors.beatLines;
    ctx.lineWidth = 1;

    for (const time of getBeatLineTimes(config.chart, Time.Zero, new Time(10))) {
        let y = time.value * config.pixelsPerSecond;

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

export function drawNoteField(el: HTMLCanvasElement, config: NoteFieldConfig) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    const { width: w, height: h } = el;
    const drawProps = { ctx, w, h, config };

    clear(drawProps);
    drawBeatLines(drawProps);
    drawReceptors(drawProps);
}

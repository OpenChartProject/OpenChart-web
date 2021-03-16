import { Beat } from "../charting/beat";
import { NoteFieldConfig } from "./config";

export function drawNoteField(el: HTMLCanvasElement, config: NoteFieldConfig) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    const { width: w, height: h } = el;

    // Clear the notefield with the background color.
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);

    // Draw the beat lines.
    let beat = Beat.Zero;
    let y = 0;
    ctx.strokeStyle = config.colors.beatLines;
    ctx.lineWidth = 1;

    while (y < h) {
        y = config.chart.bpms.timeAt(beat).value * config.pixelsPerSecond;

        if (ctx.lineWidth % 2 === 1) {
            y += 0.5;
        }

        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        beat.value++;
    }

    // Draw the receptors.
    for (let i = 0; i < config.keyCount; i++) {
        ctx.drawImage(config.noteSkin.receptor[i], i * config.columnWidth, 0);
    }
}

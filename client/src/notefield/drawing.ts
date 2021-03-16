import { NoteFieldConfig } from "./config";

export function drawNoteField(el: HTMLCanvasElement, config: NoteFieldConfig) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, el.width, el.height);

    for (let i = 0; i < config.keyCount; i++) {
        ctx.drawImage(config.noteSkin.receptor[i], i * config.columnWidth, 0);
    }
}

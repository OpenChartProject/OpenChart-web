import { BeatLineStyle } from "../../store";
import { NotefieldContext } from "../context";

import { KeyImage, NotefieldDrawData } from "./drawData";

function clear(renderCtx: CanvasRenderingContext2D, w: number, h: number) {
    renderCtx.save();
    renderCtx.resetTransform();
    renderCtx.clearRect(0, 0, w, h);
    renderCtx.restore();
}

function drawBeatLines(
    renderCtx: CanvasRenderingContext2D,
    ctx: NotefieldContext,
    data: NotefieldDrawData,
) {
    const drawLines = (yPositions: number[], { color, lineWidth }: BeatLineStyle) => {
        renderCtx.strokeStyle = color;
        renderCtx.lineWidth = lineWidth;

        renderCtx.beginPath();

        for (let y of yPositions) {
            if (renderCtx.lineWidth % 2 === 1) {
                y += 0.5;
            }

            renderCtx.moveTo(0, y);
            renderCtx.lineTo(ctx.w, y);
        }

        renderCtx.closePath();
        renderCtx.stroke();
    };

    drawLines(data.beatLines.measure, ctx.notefieldDisplay.data.beatLines.measureLines);
    drawLines(data.beatLines.beat, ctx.notefieldDisplay.data.beatLines.wholeBeatLines);
    drawLines(data.beatLines.snap, ctx.notefieldDisplay.data.beatLines.fractionalLines);
}

function drawKeyImage(
    renderCtx: CanvasRenderingContext2D,
    ctx: NotefieldContext,
    keyImage: KeyImage,
) {
    renderCtx.save();
    renderCtx.translate(keyImage.key * ctx.notefieldDisplay.data.columnWidth, keyImage.absY);

    // We need to mirror images vertically to preserve their appearance, since we mirror the
    // notefield when we start drawing if the scroll direction is down
    if (ctx.notefieldDisplay.data.scrollDirection === "down") {
        renderCtx.scale(1, -1);
    }

    renderCtx.drawImage(keyImage.img, 0, 0, ctx.notefieldDisplay.data.columnWidth, keyImage.h);
    renderCtx.restore();
}

/**
 * Draws a bounding box around a selected key image.
 */
function drawSelection(
    renderCtx: CanvasRenderingContext2D,
    ctx: NotefieldContext,
    keyImage: KeyImage,
) {
    renderCtx.save();
    renderCtx.translate(keyImage.key * ctx.notefieldDisplay.data.columnWidth, keyImage.absY);

    // The outline for the selection boxes is a bit blurry when the transform isn't
    // lined up with a whole pixel. This just takes the existing transform and aligns it
    // by making the translate values whole numbers.
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform#syntax
    const { a, b, c, d, e, f } = renderCtx.getTransform();
    renderCtx.setTransform(a, b, c, d, Math.floor(e), Math.floor(f));

    const w = ctx.notefieldDisplay.data.columnWidth;
    const h = keyImage.h;

    renderCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
    renderCtx.fillRect(0, 0, w, h);

    renderCtx.lineWidth = 2;
    renderCtx.strokeStyle = "white";
    renderCtx.strokeRect(0, 0, w, h);

    renderCtx.restore();
}

function drawReceptors(
    renderCtx: CanvasRenderingContext2D,
    ctx: NotefieldContext,
    data: NotefieldDrawData,
) {
    for (const receptor of data.receptors) {
        drawKeyImage(renderCtx, ctx, receptor);
    }
}

function drawTaps(
    renderCtx: CanvasRenderingContext2D,
    ctx: NotefieldContext,
    data: NotefieldDrawData,
) {
    for (const tap of data.objects.taps) {
        drawKeyImage(renderCtx, ctx, tap);

        const selected = ctx.notefield.data.selectedNotes[tap.key].indexOf(tap.index) !== -1;

        if (selected) {
            drawSelection(renderCtx, ctx, tap);
        }
    }
}

export function drawNotefield(
    canvas: HTMLCanvasElement,
    context: NotefieldContext,
    data: NotefieldDrawData,
) {
    const renderCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    renderCtx.save();

    // This mirrors the notefield vertically, so now the canvas origin is in the bottom
    // left corner instead of the top left corner.
    if (context.notefieldDisplay.data.scrollDirection === "down") {
        renderCtx.translate(0, context.h);
        renderCtx.scale(1, -1);
    }

    // Move the viewport to the current scroll position.
    renderCtx.translate(0, -context.viewport.y0);

    clear(renderCtx, context.w, context.h);
    drawBeatLines(renderCtx, context, data);
    drawReceptors(renderCtx, context, data);
    drawTaps(renderCtx, context, data);

    renderCtx.restore();
}

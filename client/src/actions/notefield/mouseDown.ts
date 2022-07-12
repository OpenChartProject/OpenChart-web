import { absToCanvasY } from "../../notefield/drawing/util";
import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the MouseDownAction.
 */
export interface MouseDownArgs {
    event: MouseEvent;

    /* If true, the mouse was pressed while on the notefield canvas. */
    inCanvas: boolean;
}

/**
 * Action for handling a mouse down event.
 */
export class MouseDownAction implements Action {
    args: MouseDownArgs;
    store: RootStore;

    constructor(store: RootStore, args: MouseDownArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        if (this.args.inCanvas) {
            this.handleCanvas();
        } else {
            this.handleContainer();
        }
    }

    private handleCanvas() {
        const { canvas, ctx, drawData } = this.store.notefield;

        if (!canvas || !ctx || !drawData) {
            return;
        }

        const e = this.args.event;

        for (const t of drawData.objects.taps) {
            const canvasRect = canvas.getBoundingClientRect();
            const canvasY = absToCanvasY(ctx, t.absY);

            // Calculate the bounding box of the tap note
            const rect = {
                x0: canvasRect.left + (t.key * ctx.notefieldDisplay.data.columnWidth),
                y0: canvasY,
                x1: canvasRect.left + ((t.key + 1) * ctx.notefieldDisplay.data.columnWidth),
                y1: canvasY + t.h,
            }

            // Was the mouse pressed inside the bounding box?
            const hit = (rect.x0 <= e.clientX && e.clientX <= rect.x1) && (rect.y0 <= e.clientY && e.clientY <= rect.y1);

            if (hit) {
                console.log("pressed tap");
            }
        }
    }

    private handleContainer() {

    }
}

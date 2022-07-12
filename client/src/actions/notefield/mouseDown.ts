import { getKeyImageBoundingBox } from "../../notefield/drawing/util";
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
            const rect = getKeyImageBoundingBox(
                t,
                this.store.notefield,
                this.store.notefieldDisplay,
            );

            // Was the mouse pressed inside the bounding box?
            const hit =
                rect.x0 <= e.clientX &&
                e.clientX <= rect.x1 &&
                rect.y0 <= e.clientY &&
                e.clientY <= rect.y1;

            if (hit) {
                // select note
            }
        }
    }

    private handleContainer() { }
}

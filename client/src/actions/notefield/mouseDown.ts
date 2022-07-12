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
        const { taps } = this.store.notefield.data.drawData!.objects;

        for (const t of taps) {
            // do stuff
        }
    }

    private handleContainer() {

    }
}

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
        let hitSomething = false;

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
                if (!e.ctrlKey && !e.shiftKey) {
                    // Check if there is just one note selected and the user is trying to toggle it
                    const justOneAndToggling = this.store.notefield.selectedNoteCount === 1 && this.store.notefield.isSelected(t.key, t.index);

                    // If the user isn't holding the ctrl or shift key we want to clear their
                    // selection first, but only if they aren't just toggling a single note.
                    // If we reset when trying to toggle a single note, it clears the selection
                    // then selects the note again, leaving the note stuck on selected.
                    if (!justOneAndToggling) {
                        this.store.notefield.clearSelectedNotes();
                    }
                }

                this.store.notefield.toggleSelectNote(t.key, t.index);
                hitSomething = true;
                break;
            }
        }

        if (!hitSomething) {
            this.store.notefield.clearSelectedNotes();
        }
    }

    private handleContainer() {
        this.store.notefield.clearSelectedNotes();
    }
}

import { RootStore, ScrollDirection } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the ScrollDirectionAction.
 */
export interface ScrollDirectionArgs {
    to: ScrollDirection | "swap";
}

/**
 * Action for setting the notefield scroll direction.
 */
export class ScrollDirectionAction implements Action {
    args: ScrollDirectionArgs;
    store: RootStore;

    constructor(store: RootStore, args: ScrollDirectionArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { to } = this.args;
        const { data } = this.store.editor;

        if (to === "swap") {
            if (data.scrollDirection === "up") {
                this.store.editor.update({ scrollDirection: "down" });
            } else {
                this.store.editor.update({ scrollDirection: "up" });
            }
        } else {
            this.store.editor.update({ scrollDirection: to });
        }
    }
}

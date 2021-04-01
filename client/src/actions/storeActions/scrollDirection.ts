import { RootStore, ScrollDirection } from "../../store/";
import { Action } from "../action";

export interface ScrollDirectionArgs {
    to: ScrollDirection | "swap";
}

export class ScrollDirectionAction implements Action {
    args: ScrollDirectionArgs;
    store: RootStore;

    constructor(store: RootStore, args: ScrollDirectionArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { to } = this.args;
        const { config, update } = this.store.editor;

        if (to === "swap") {
            if (config.scrollDirection === "up") {
                update({ scrollDirection: "down" });
            } else {
                update({ scrollDirection: "up" });
            }
        } else {
            update({ scrollDirection: to });
        }
    }
}

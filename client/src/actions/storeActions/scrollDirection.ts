import { ScrollDirection } from "../../notefield/config";
import { Store } from "../../store/";
import { Action } from "../action";

export interface ScrollDirectionArgs {
    to: ScrollDirection | "swap";
}

export class ScrollDirectionAction implements Action {
    args: ScrollDirectionArgs;
    store: Store;

    constructor(store: Store, args: ScrollDirectionArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        const { to } = this.args;

        if (to === "swap") {
            if (this.store.config.scrollDirection === "up") {
                this.store.setScrollDirection("down");
            } else {
                this.store.setScrollDirection("up");
            }
        } else {
            this.store.setScrollDirection(to);
        }
    }
}

import { Store } from "../../store";
import { Action } from "../action";

export interface MetronomeArgs {
    enabled: boolean;
}

export class MetronomeAction implements Action {
    args: MetronomeArgs;
    store: Store;

    constructor(store: Store, args: MetronomeArgs) {
        this.args = args;
        this.store = store;
    }

    run(): void {
        this.store.setMetronome(this.args.enabled);
    }
}

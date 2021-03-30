import { Time } from "../charting";

import { Store } from "./store";

export class AutoScroll {
    earlier: number = -1;
    store: Store;

    constructor(store: Store) {
        this.store = store;
        this.onFrame = this.onFrame.bind(this);
    }

    onFrame(time: number) {
        if (!this.store.state.isPlaying) {
            return;
        }

        if (this.earlier === -1) {
            this.earlier = time;
        }

        const seconds = (time - this.earlier) / 1000;

        this.store.setScroll({ time: new Time(seconds) });
        requestAnimationFrame(this.onFrame);
    }

    start() {
        requestAnimationFrame(this.onFrame);
    }
}

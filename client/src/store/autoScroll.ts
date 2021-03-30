import { Metronome } from "./metronome";
import { Store } from "./store";

export class AutoScroll {
    earlier: number;
    metronome: Metronome;
    store: Store;

    constructor(store: Store) {
        this.store = store;
        this.earlier = -1;
        this.metronome = new Metronome(store);

        this.onFrame = this.onFrame.bind(this);
    }

    onFrame(time: number) {
        const state = this.store.state;

        if (!state.isPlaying) {
            return;
        }

        if (this.earlier === -1) {
            this.earlier = time;
        }

        const seconds = (time - this.earlier) / 1000;

        this.store.scrollBy({ time: seconds });
        this.metronome.update(state.scroll.beat);

        this.earlier = time;

        requestAnimationFrame(this.onFrame);
    }

    start() {
        this.earlier = -1;
        requestAnimationFrame(this.onFrame);
    }
}

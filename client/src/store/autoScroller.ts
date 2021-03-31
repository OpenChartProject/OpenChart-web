import { Metronome } from "./metronome";
import { Store } from "./store";

/**
 * This handles the auto scrolling of the notefield.
 */
export class AutoScroller {
    earlier: number;
    metronome: Metronome;
    store: Store;

    constructor(store: Store) {
        this.store = store;
        this.earlier = -1;
        this.metronome = new Metronome(store);

        this.onFrame = this.onFrame.bind(this);
    }

    /**
     * This is called when the browser responds to our animation frame request.
     *
     * The function gets passed the current time in milliseconds. It calculates the delta
     * from the previous `onFrame` call, then scrolls the notefield by that amount.
     *
     * This function will call requestAnimationFrame indefinitely until `isPlaying` is
     * false.
     */
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

    /**
     * Starts the auto scrolling. The auto scroller checks each frame if it should continue
     * auto scrolling based on the value of `isPlaying`.
     */
    start() {
        this.earlier = -1;
        requestAnimationFrame(this.onFrame);
    }
}

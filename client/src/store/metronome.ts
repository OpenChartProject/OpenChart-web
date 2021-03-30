import { Beat } from "../charting";

import { Store } from "./store";

const elMetronome = document.getElementById("audio-tick") as HTMLAudioElement;

export class Metronome {
    lastBeat?: Beat;
    store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    tick() {
        if (!this.store.state.enableMetronome) {
            return;
        }

        elMetronome.currentTime = 0;
        elMetronome.play();
    }

    update(beat: Beat) {
        if (!this.lastBeat) {
            this.lastBeat = beat;
        }

        if (beat.isWholeBeat() || Math.floor(beat.value) > this.lastBeat.value) {
            this.tick();
        }

        this.lastBeat = beat;
    }
}

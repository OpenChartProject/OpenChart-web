import { Beat } from "../charting";

import { EditorConfigStore } from "./editorConfig";

const elMetronome = document.getElementById("audio-tick") as HTMLAudioElement;

/**
 * This handles playing the metronome ticks while the chart is playing.
 */
export class Metronome {
    lastBeat?: Beat;
    editorConfig: EditorConfigStore;

    constructor(editorConfig: EditorConfigStore) {
        this.editorConfig = editorConfig;
    }

    /**
     * Plays a metronome tick (if it's enabled).
     */
    tick() {
        if (!this.editorConfig.config.enableMetronome) {
            return;
        }

        elMetronome.currentTime = 0;
        elMetronome.play();
    }

    /**
     * This calculates if the metronome should tick or not based on the provided beat.
     * The metronome only ticks on whole beats and when it crosses a "beat boundary".
     */
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

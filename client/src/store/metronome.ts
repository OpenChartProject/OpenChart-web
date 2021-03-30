import { Beat } from "../charting";

const elMetronome = document.getElementById("audio-tick") as HTMLAudioElement;

export class Metronome {
    lastBeat?: Beat;

    tick() {
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

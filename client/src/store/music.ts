const elMusic = document.getElementById("audio-music") as HTMLAudioElement;

/**
 * This is a simple wrapper around an `<audio>` tag.
 */
export class Music {
    el: HTMLAudioElement;

    constructor(el?: HTMLAudioElement) {
        this.el = el ?? elMusic;
    }

    playAt(time: number) {
        if (!this.el.src) {
            return;
        }

        this.el.currentTime = time;
        this.el.play();
    }

    pause() {
        this.el.pause();
    }

    setSource(src: string) {
        this.el.src = src;
    }
}

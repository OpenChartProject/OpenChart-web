import { UIStore } from "../ui";

/**
 * This is a simple wrapper around an `<audio>` tag.
 */
export class MusicController {
    store: UIStore;

    constructor(store: UIStore) {
        this.store = store;
    }

    play() {
        this.store.emitters.music.emit("play");
    }

    pause() {
        this.store.emitters.music.emit("pause");
    }

    seek(time: number) {
        this.store.emitters.music.emit("seek", time);
    }

    setSource(src: string) {
        if (src === this.store.data.music.src) {
            return;
        }

        this.store.update({ music: { src } });
    }

    setVolume(volume: number) {
        this.store.update({ music: { volume } });
    }
}

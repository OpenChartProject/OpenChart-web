import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

/**
 * This component is a simple wrapper around an <audio> element and is used
 * for music playback.
 */
export const Music = observer(({ store }: Props) => {
    const ref = useRef<HTMLAudioElement>(null);
    const { src, volume } = store.ui.data.music;

    const onPlay = () => {
        const el = ref.current!;

        if (!store.ui.data.music.src) {
            return;
        }

        el.play();
    };

    const onPause = () => {
        const el = ref.current!;

        if (!store.ui.data.music.src) {
            return;
        }

        el.pause();
    };

    const onSeek = (time: number) => {
        const el = ref.current!;

        if (!store.ui.data.music.src) {
            return;
        }

        el.currentTime = time - store.project.data.song.audioOffset;
    };

    useEffect(() => {
        const music = store.ui.emitters.music;

        music.on("play", onPlay).on("pause", onPause).on("seek", onSeek);

        return () => {
            music.off("play", onPlay).off("pause", onPause).off("seek", onSeek);
            return;
        };
    }, []);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        // Convert the volume from linear to logarithmic
        ref.current.volume = Math.pow(volume, 2);
    }, [ref, volume]);

    return <audio ref={ref} src={src}></audio>;
});

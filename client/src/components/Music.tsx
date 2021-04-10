import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Music = observer(({ store }: Props) => {
    const ref = useRef<HTMLAudioElement>(null);
    const { volume } = store.ui.data.music;

    const onPlay = () => {
        const el = ref.current!;
        el.play();
    };

    const onPause = () => {
        const el = ref.current!;
        el.pause();
    };

    const onSeek = (time: number) => {
        const el = ref.current!;
        el.currentTime = time - store.notefield.data.audioOffset;
    };

    useEffect(() => {
        const music = store.ui.emitters.music;

        music.on("play", onPlay).on("pause", onPause).on("seek", onSeek);

        return () => {
            music.off("play", onPlay).off("pause", onPause).off("seek", onSeek);
            return;
        };
    });

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        // Convert the volume from linear to logarithmic
        ref.current.volume = Math.pow(volume, 2);
    }, [ref, volume]);

    return <audio ref={ref} src={store.ui.data.music.src}></audio>;
});

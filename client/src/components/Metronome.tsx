import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { sndTick } from "../assets";
import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Metronome = observer(({ store }: Props) => {
    const ref = useRef<HTMLAudioElement>(null);
    const { volume } = store.ui.data.metronome;

    const onTick = () => {
        const el = ref.current;

        if (!el || !store.ui.data.metronome.enabled) {
            return;
        }

        el.currentTime = 0;
        el.play();
    };

    useEffect(() => {
        store.ui.emitters.metronome.on("tick", onTick);
        return () => {
            store.ui.emitters.metronome.off("tick", onTick);
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

    return <audio src={sndTick} ref={ref}></audio>;
});

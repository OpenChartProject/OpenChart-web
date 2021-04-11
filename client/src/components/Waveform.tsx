import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../store";

import { WaveformSVG } from "./WaveformSVG";

const LOW_QUALITY_SCALAR = 4;

export interface Props {
    store: RootStore;
}

export const Waveform = observer(({ store }: Props) => {
    if (
        !store.notefieldDisplay.data.showWaveform ||
        (store.notefield.data.isPlaying && !store.notefieldDisplay.data.showWaveformWhilePlaying)
    ) {
        return null;
    }

    const { notefield, waveform } = store;
    let pps = notefield.pixelsPerSecond;

    if (!store.notefieldDisplay.data.highQualityWaveform) {
        pps /= LOW_QUALITY_SCALAR;
    }

    const el = waveform.getBestMatchingWaveform(pps);

    if (!el) {
        return null;
    }

    return (
        <div className="waveform-container">
            <WaveformSVG store={store} el={el} />
        </div>
    );
});

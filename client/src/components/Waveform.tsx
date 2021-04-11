import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../store";

import { WaveformSVG } from "./WaveformSVG";

export interface Props {
    store: RootStore;
}

export const WaveformWrapper = observer(({ store }: Props) => {
    if (!store.notefieldDisplay.data.showWaveform) {
        return null;
    }

    const { notefield, waveform } = store;
    const el = waveform.getBestMatchingWaveform(notefield.pixelsPerSecond);

    if (!el) {
        return null;
    }

    return (
        <div className="waveform-container">
            <WaveformSVG store={store} el={el} />
        </div>
    );
});

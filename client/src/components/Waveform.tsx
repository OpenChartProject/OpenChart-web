import { observer } from "mobx-react-lite";
import React from "react";
import convert from "react-from-dom";

import { RootStore } from "../store";
import { WaveformElement } from "../store/waveform";

export interface Props {
    store: RootStore;
}

export interface WaveformSVGProps {
    el: WaveformElement;
    store: RootStore;
}

export const WaveformSVG = observer(({ el, store }: WaveformSVGProps) => {
    const { notefield } = store;
    const { receptorY, scrollDirection } = store.notefieldDisplay.data;

    const zoom = notefield.data.zoom.valueOf();
    const height = notefield.data.height;

    // This took me like 3 hours to figure out lol
    let y0 =
        (notefield.data.scroll.time.value - notefield.data.audioOffset) * notefield.pixelsPerSecond;

    if (scrollDirection === "down") {
        y0 = -(y0 + notefield.data.height);
        y0 += receptorY;
    } else {
        y0 -= receptorY;
    }

    // Dividing by zoom converts from screen coordinates to notefield coordinates
    const viewBox = `-250 ${y0 / zoom} 500 ${height / zoom}`;

    const attributes: Record<string, string> = {
        viewBox,
        preserveAspectRatio: "none",
        height: height + "px",
    };

    for (const key in attributes) {
        el.svg.setAttribute(key, attributes[key]);
    }

    return <React.Fragment>{convert(el.svg)}</React.Fragment>;
});

export const Waveform = observer(({ store }: Props) => {
    const { notefield } = store;

    let lastDiff = Number.MAX_VALUE;
    let index = 0;

    for (let i = 0; i < store.waveform.data.el.length; i++) {
        const el = store.waveform.data.el[i];
        const diff = Math.abs(el.data.pixels_per_second - notefield.pixelsPerSecond);

        if (diff < lastDiff) {
            lastDiff = diff;
            index = i;
        }
    }

    return (
        <div className="waveform-container">
            <WaveformSVG store={store} el={store.waveform.data.el[index]} />
        </div>
    );
});

export const WaveformWrapper = observer(({ store }: Props) => {
    if (store.waveform.data.el.length === 0 || !store.notefieldDisplay.data.showWaveform) {
        return null;
    }

    return <Waveform store={store} />;
});

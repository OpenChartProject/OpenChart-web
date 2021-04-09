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
    const { editor, noteField } = store;

    const zoom = noteField.data.zoom.valueOf();
    const height = noteField.data.height;

    // This took me like 3 hours to figure out lol
    let y0 =
        (noteField.data.scroll.time.value - noteField.data.audioOffset) * noteField.pixelsPerSecond;

    if (editor.data.scrollDirection === "down") {
        y0 = -(y0 + noteField.data.height);
        y0 += editor.data.receptorY;
    } else {
        y0 -= editor.data.receptorY;
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
    const { noteField } = store;

    let lastDiff = Number.MAX_VALUE;
    let index = 0;

    for (let i = 0; i < store.waveform.data.el.length; i++) {
        const el = store.waveform.data.el[i];
        const diff = Math.abs(el.data.pixels_per_second - noteField.pixelsPerSecond);

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
    if (store.waveform.data.el.length === 0 || !store.editor.data.showWaveform) {
        return null;
    }

    return <Waveform store={store} />;
});

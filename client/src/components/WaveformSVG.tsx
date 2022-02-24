import { observer } from "mobx-react-lite";
import React from "react";
import convert from "react-from-dom/lib";

import { RootStore } from "../store";
import { WaveformElement } from "../store/waveform";

export interface Props {
    el: WaveformElement;
    store: RootStore;
}

/**
 * The component for the waveform display.
 *
 * This is responsible for taking an existing SVG element (containing the waveform)
 * and adjusting its viewbox and height to be rendered properly on the page.
 */
export const WaveformSVG = observer(({ el, store }: Props) => {
    const { notefield, waveform } = store;
    const { x, y, width, height } = waveform.viewBox;

    const attributes: Record<string, number | string> = {
        viewBox: `${x} ${y} ${width} ${height}`,
        preserveAspectRatio: "none",
        height: notefield.data.height,
    };

    for (const key in attributes) {
        el.svg.setAttribute(key, attributes[key].toString());
    }

    return <React.Fragment>{convert(el.svg)}</React.Fragment>;
});

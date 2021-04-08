import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useRef } from "react";
import convert from "react-from-dom";
import { calculateViewport } from "../notefield/drawing";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Waveform = observer(({ store }: Props) => {
    if (store.waveform.data.el.length === 0) {
        return null;
    }

    const { editor, noteField } = store;
    const zoom = noteField.data.zoom.valueOf();
    const width = noteField.data.width;
    const height = noteField.data.height;

    // This took me like 3 hours to figure out lol
    let y0 = noteField.data.scroll.time.value * noteField.pixelsPerSecond;

    if (editor.data.scrollDirection === "down") {
        y0 = -(y0 + noteField.data.height);
        y0 += editor.data.receptorY;
    } else {
        y0 -= editor.data.receptorY;
    }

    // Dividing by zoom converts from screen coordinates to notefield coordinates
    const viewBox = `-250 ${y0 / zoom} 500 ${height / zoom}`;

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

    const Svg = store.waveform.data.el[index].svg;
    const attributes: Record<string, string> = {
        viewBox,
        preserveAspectRatio: "none",
        width: width + "px",
        height: height + "px",
    };

    for (const key in attributes) {
        Svg.setAttribute(key, attributes[key]);
    }

    console.log(index);

    return (<div className="waveform-container">{convert(Svg)}</div>);
});

import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useRef } from "react";
import { calculateViewport } from "../notefield/drawing";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Waveform = observer(({ store }: Props) => {
    const ref = useRef<SVGSVGElement>(null);
    const { editor, noteField } = store;
    const zoom = noteField.data.zoom.valueOf();

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        store.waveform.setElement(ref.current);
    }, [ref]);

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

    return (
        <svg
            className="waveform"
            xmlns="http://www.w3.org/2000/svg"
            ref={ref}
            viewBox={viewBox}
            preserveAspectRatio="none"
            width={width}
            height={height}
        ></svg>
    );
});

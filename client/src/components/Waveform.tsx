import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useRef } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Waveform = observer(({ store }: Props) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        store.waveform.setElement(ref.current);
    }, [ref]);

    const offset =
        store.editor.data.receptorY -
        store.noteField.data.scroll.time.value * store.noteField.pixelsPerSecond;

    const style: CSSProperties = {
        height: store.noteField.data.width + "px",
    };

    if (store.editor.data.scrollDirection === "up") {
        style.top = offset + "px";
    } else {
        style.bottom = offset + "px";
    }

    return (
        <svg className="waveform" xmlns="http://www.w3.org/2000/svg" ref={ref} style={style}></svg>
    );
});

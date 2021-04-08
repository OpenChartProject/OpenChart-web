import React, { useEffect, useRef } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const Waveform = (props: Props) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        props.store.waveform.setElement(ref.current);
    }, [ref]);

    return <svg className="waveform" xmlns="http://www.w3.org/2000/svg" ref={ref}></svg>;
};

import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const TimePicker = observer(({ store }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [y, setY] = useState(0);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        ref.current.addEventListener("mousemove", (e) => {
            setY(e.clientY);
        });
    }, [ref]);

    return (
        <div className="time-selector-container" ref={ref}>
            <div className="time-selector-bar" style={{ top: y + "px" }}></div>
        </div>
    );
});

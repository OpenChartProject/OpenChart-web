import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

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

        ref.current.addEventListener("click", (e) => {
            const { timePicker } = store.ui.tools;

            if (timePicker.onPick) {
                timePicker.onPick();
            }
        });
    }, [ref]);

    const style: CSSProperties = {
        top: (y - 1) + "px",
    };

    return (
        <div className="time-selector-container" ref={ref}>
            <div className="time-selector-bar" style={style}></div>
        </div>
    );
});

import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const TimePicker = observer(({ store }: Props) => {
    const [y, setY] = useState(0);

    const onClick = () => {
        const { timePicker } = store.ui.tools;

        if (timePicker.onPick) {
            timePicker.onPick();
        }
    }

    const style: CSSProperties = {
        top: (y - 1) + "px",
    };

    return (
        <div className="time-selector-container" onClick={onClick} onMouseMove={(e) => setY(e.clientY)}>
            <div className="time-selector-bar" style={style}></div>
        </div>
    );
});

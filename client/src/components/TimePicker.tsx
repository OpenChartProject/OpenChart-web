import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useState } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const TimePicker = observer(({ store }: Props) => {
    const { editor, noteField } = store;
    const [y, setY] = useState(0);

    const onClick = () => {
        const { timePicker } = store.ui.tools;

        if (timePicker.onPick) {
            const receptorDistance = editor.data.receptorY - y;
            const time =
                noteField.data.scroll.time.value - receptorDistance / noteField.pixelsPerSecond;

            timePicker.onPick(y, time);
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        // Cancel the picker if the user presses escape
        if (e.key === "Escape") {
            const fn = store.ui.tools.timePicker.onCancel;

            if (fn) {
                fn();
            }

            store.ui.deactivateTimePicker();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const style: CSSProperties = {
        top: y - 1,
    };

    return (
        <div
            className="time-selector-container"
            onClick={onClick}
            onMouseMove={(e) => setY(e.clientY)}
        >
            <div className="time-selector-bar" style={style}></div>
        </div>
    );
});

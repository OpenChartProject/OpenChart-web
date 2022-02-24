import { observer } from "mobx-react-lite";
import React, { CSSProperties, useEffect, useState } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

/**
 * The component for the time picker.
 *
 * This is rendered over the notefield and displays a green line wherever the
 * user's mouse is. When the user clicks a point on the notefield it calls
 * `store.ui.tools.timePicker.onPick`. If the user presses escape the time picker
 * is cancelled.
 */
export const TimePicker = observer(({ store }: Props) => {
    const [y, setY] = useState(0);

    const onClick = () => {
        const { receptorY } = store.notefieldDisplay.data;
        const { scroll } = store.notefield.data;
        const { timePicker } = store.ui.tools;

        if (timePicker.onPick) {
            const receptorDistance = receptorY - y;
            const time = scroll.time.value - receptorDistance / store.notefield.pixelsPerSecond;

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

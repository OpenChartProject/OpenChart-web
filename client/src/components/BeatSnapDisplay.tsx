import { observer } from "mobx-react-lite";
import React, { CSSProperties } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

/**
 * A simple component shown on the side of the notefield that says what
 * the current beat snapping is.
 */
export const BeatSnapDisplay = observer(({ store }: Props) => {
    const { receptorY, scrollDirection } = store.notefieldDisplay.data;
    const { snap } = store.notefield.data;

    let style: CSSProperties;

    if (scrollDirection === "up") {
        style = {
            top: receptorY + "px",
        };
    } else {
        style = {
            bottom: receptorY + "px",
        };
    }

    return (
        <div className="beatsnap" style={style}>
            {snap.current.toFraction()}
        </div>
    );
});

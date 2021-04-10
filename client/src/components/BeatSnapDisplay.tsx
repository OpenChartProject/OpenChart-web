import { observer } from "mobx-react-lite";
import React, { CSSProperties } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const BeatSnapDisplay = observer(({ store }: Props) => {
    const { receptorY, scrollDirection } = store.notefieldDisplay.data;
    const { snap } = store.notefield.data;

    let style: CSSProperties;

    if (scrollDirection === "up") {
        style = {
            top: receptorY + "px",
            transform: "translateY(-50%)",
        };
    } else {
        style = {
            bottom: receptorY + "px",
            transform: "translateY(50%)",
        };
    }

    return (
        <div className="beatsnap" style={style}>
            {snap.current.toFraction()}
        </div>
    );
});

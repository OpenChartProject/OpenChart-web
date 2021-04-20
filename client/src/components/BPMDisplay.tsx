import { observer } from "mobx-react-lite";
import React, { CSSProperties } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const BPMDisplay = observer((props: Props) => {
    const { notefield, ui } = props.store;
    const bpms = notefield.data.chart.bpms.getAll();

    const selectBPM = (i: number) => {
        ui.selectBPM(i);
    };

    const items = bpms.map((x, i) => {
        const style: CSSProperties = {
            top: notefield.timeToScreenPosition(x.time.value),
        };

        const title = `${x.bpm.value}bpm @ ${x.time.value.toFixed(3)}s`;

        return (
            <div
                className="bpm-item-container"
                key={x.bpm.beat.value}
                onClick={() => selectBPM(i)}
                style={style}
                title={title}
            >
                <div className="bpm-item">{x.bpm.value}</div>
            </div>
        );
    });

    return <React.Fragment>{items}</React.Fragment>;
});

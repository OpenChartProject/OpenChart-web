import { observer } from "mobx-react-lite";
import React, { CSSProperties } from "react";

import { RootStore } from "../store";

export interface Props {
    store: RootStore;
}

export const BPMDisplay = observer((props: Props) => {
    const { notefield } = props.store;
    const bpms = notefield.data.chart.bpms.getAll();
    const items = bpms.map((x) => {
        const style: CSSProperties = {
            top: notefield.timeToScreenPosition(x.time.value),
        };

        const title = `${x.bpm.value}bpm @ ${x.time.value.toFixed(3)}s`;

        return (
            <div className="bpm-item-container" key={x.bpm.beat.value} style={style} title={title}>
                <div className="bpm-item">{x.bpm.value}</div>
            </div>
        );
    });

    return <React.Fragment>{items}</React.Fragment>;
});

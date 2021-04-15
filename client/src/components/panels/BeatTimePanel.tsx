import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const BeatTimePanel = observer((props: Props) => {
    const { notefield, ui } = props.store;
    const { beat, time } = notefield.data.scroll;

    const [beatVal, setBeatVal] = useState(beat.value.toFixed(3));
    const [timeVal, setTimeVal] = useState(time.value.toFixed(3));

    const disabled = notefield.data.isPlaying;
    const visible = ui.data.panelVisibility.beatTime;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { beatTime: !visible });
    };

    return (
        <Panel title="Beat &amp; Time" visible={visible} onToggle={onToggle}>
            <form onSubmit={onSubmit}>
                <div className="form-control-grid form-control-grid-half">
                    <div className="form-control">
                        <label className="form-label form-label-dark">Beat</label>
                        <input
                            className="form-input"
                            type="text"
                            value={beatVal}
                            onChange={(e) => setBeatVal(e.currentTarget.value)}
                            disabled={disabled}
                        />
                    </div>
                    <div className="form-control">
                        <label className="form-label form-label-dark">Time</label>
                        <input
                            className="form-input"
                            type="text"
                            value={timeVal}
                            onChange={(e) => setTimeVal(e.currentTarget.value)}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </form>
        </Panel>
    );
});

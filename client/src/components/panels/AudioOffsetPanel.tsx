import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const AudioOffsetPanel = observer((props: Props) => {
    const { noteField, ui } = props.store;
    const visible = ui.data.panelVisibility.audioOffset;

    const onToggle = () => {
        ui.update({ panelVisibility: { audioOffset: !visible } });
    };

    return (
        <Panel title="Audio Offset" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">
                    Offset (seconds)
                <input
                        type="text"
                        className="form-input"
                        value={noteField.data.audioOffset.toFixed(3)}
                    />
                </label>
            </div>
        </Panel>
    );
});

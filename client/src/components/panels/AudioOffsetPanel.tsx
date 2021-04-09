import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { FormEvent, useState } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const AudioOffsetPanel = observer((props: Props) => {
    const { noteField, ui } = props.store;
    const visible = ui.data.panelVisibility.audioOffset;
    const [inputVal, setInputVal] = useState(noteField.data.audioOffset.toFixed(3));

    const reset = () => {
        setInputVal(noteField.data.audioOffset.toFixed(3));
    };

    const update = () => {
        if (!/^[-+]?\d*\.?\d*$/.test(inputVal)) {
            reset();
            return;
        }

        noteField.setAudioOffset(_.toNumber(inputVal));
        reset();
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        update();
        (document.activeElement as HTMLElement).blur();
    };

    const onToggle = () => {
        ui.update({ panelVisibility: { audioOffset: !visible } });
    };

    return (
        <Panel title="Audio Offset" visible={visible} onToggle={onToggle}>
            <form onSubmit={onSubmit}>
                <div className="form-control">
                    <label className="form-label form-label-dark">
                        Offset (seconds)
                        <input
                            type="text"
                            className="form-input"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.currentTarget.value)}
                            onBlur={update}
                        />
                    </label>
                </div>
            </form>
        </Panel>
    );
});

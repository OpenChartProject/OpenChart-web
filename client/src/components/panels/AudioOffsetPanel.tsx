import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { FormEvent } from "react";

import { RootStore } from "../../store";
import { blurEverything } from "../../util";
import { ManagedNumberField, PickTimeButton } from "../controls";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const AudioOffsetPanel = observer((props: Props) => {
    const { notefield, ui } = props.store;
    const visible = ui.data.panelVisibility.audioOffset;

    const onOffsetChanged = (val: number) => {
        notefield.setAudioOffset(val);
    };

    const onPickTime = (y: number, time: number) => {
        // Set the offset relative to where it already is, since the user is
        // using the waveform to determine the offset, and if the audio offset
        // is already set, then the waveform will be moved and we want to know
        // the difference between where it is and where they clicked.
        notefield.setAudioOffset(notefield.data.audioOffset - time);
        ui.deactivateTimePicker();
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        blurEverything();
    };

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { audioOffset: !visible });
    };

    const disabled = notefield.data.isPlaying || ui.tools.timePicker.active;

    return (
        <Panel title="Audio Offset" visible={visible} onToggle={onToggle}>
            <form onSubmit={onSubmit}>
                <div className="form-control">
                    <label className="form-label form-label-dark">Offset (seconds)</label>

                    <div className="clearfix">
                        <ManagedNumberField
                            value={notefield.data.audioOffset}
                            disabled={disabled}
                            inline={true}
                            precision={3}
                            onSubmit={onOffsetChanged}
                            delta={0.001}
                        />
                        <PickTimeButton
                            store={props.store}
                            className="float-right"
                            disabled={disabled}
                            onPick={onPickTime}
                        />
                    </div>
                </div>

                <button type="submit" hidden />
            </form>
        </Panel>
    );
});

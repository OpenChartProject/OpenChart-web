import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const AudioPanel = observer((props: Props) => {
    const { ui } = props.store;
    const { visible } = ui.data.panels.audio;

    const onMetronomeVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        ui.setMetronomeVolume(_.toNumber(e.target.value));
    };

    const onMusicVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        ui.updateProperty("music", { volume: _.toNumber(e.target.value) });
    };

    const onToggleMetronome = (e: ChangeEvent<HTMLInputElement>) => {
        ui.setMetronomeEnabled(!ui.data.metronome.enabled);
        e.target.blur();
    };

    const onToggle = () => {
        ui.updatePanel("audio", { visible: !visible });
    };

    return (
        <Panel title="Audio" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">Metronome</label>
                <label className="form-label-inline form-label-light">
                    <input
                        type="checkbox"
                        className="form-input"
                        checked={ui.data.metronome.enabled}
                        onChange={onToggleMetronome}
                    />
                    Enabled
                </label>
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Metronome Volume</label>
                <input
                    className="form-input"
                    type="range"
                    title={ui.data.metronome.volume * 100 + "%"}
                    min={0}
                    max={1}
                    step={0.01}
                    value={ui.data.metronome.volume}
                    onChange={onMetronomeVolumeChange}
                />
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Music Volume</label>
                <input
                    className="form-input"
                    type="range"
                    title={ui.data.music.volume * 100 + "%"}
                    min={0}
                    max={1}
                    step={0.01}
                    value={ui.data.music.volume}
                    onChange={onMusicVolumeChange}
                />
            </div>
        </Panel>
    );
});

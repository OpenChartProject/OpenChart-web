import _ from "lodash";
import { observer } from "mobx-react-lite";
import React from "react";

import { Beat, Time } from "../../charting";
import { RootStore } from "../../store";
import { blurEverything } from "../../util";
import { NumberField, PickTimeButton } from "../controls";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const BeatTimePanel = observer((props: Props) => {
    const { notefield, ui } = props.store;
    const { beat, time } = notefield.data.scroll;

    const disabled = notefield.data.isPlaying || ui.tools.timePicker.active;
    const visible = ui.data.panelVisibility.beatTime;

    const onChanged = (args: { beat?: number; time?: number }) => {
        try {
            if (args.beat != null) {
                notefield.setScroll({ beat: new Beat(args.beat) });
            } else if (args.time != null) {
                notefield.setScroll({ time: new Time(args.time) });
            }
        } catch (e) {
            ui.notify({ type: "error", msg: (e as Error).message });
        }
    };

    const onPickTime = (y: number, pickedTime: number) => {
        notefield.setScroll({ time: new Time(Math.max(0, pickedTime)) });
        ui.deactivateTimePicker();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        blurEverything();
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
                        <NumberField
                            value={beat.value}
                            precision={3}
                            onChanged={(val) => onChanged({ beat: val })}
                        />
                    </div>
                    <div className="form-control">
                        <label className="form-label form-label-dark">Time</label>
                        <NumberField
                            value={time.value}
                            precision={3}
                            onChanged={(val) => onChanged({ time: val })}
                        />
                    </div>
                </div>

                <div className="form-buttons clearfix">
                    <PickTimeButton
                        store={props.store}
                        className="float-right"
                        disabled={disabled}
                        onPick={onPickTime}
                    />
                </div>

                <button type="submit" hidden />
            </form>
        </Panel>
    );
});

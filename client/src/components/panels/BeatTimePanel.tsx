import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { Beat, Time } from "../../charting";
import { RootStore } from "../../store";
import { blurEverything, isNumber } from "../../util";

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

    const reset = (field: "beat" | "time" | "all") => {
        if (field === "beat" || field === "all") {
            setBeatVal(beat.value.toFixed(3));
        }

        if (field === "time" || field === "all") {
            setTimeVal(time.value.toFixed(3));
        }
    };

    const submit = (): boolean => {
        if (!isNumber(beatVal) || !isNumber(timeVal)) {
            reset("all");
            return false;
        }

        try {
            if (beatVal !== beat.value.toFixed(3)) {
                notefield.setScroll({ beat: new Beat(_.toNumber(beatVal)) });
            } else if (timeVal !== time.value.toFixed(3)) {
                notefield.setScroll({ time: new Time(_.toNumber(timeVal)) });
            }

            reset("all");
            return true;
        } catch (e) {
            ui.notify({ type: "error", msg: (e as Error).message });
            return false;
        }
    };

    const onBeatBlur = () => {
        if (beatVal.trim() === "") {
            reset("beat");
        } else {
            submit();
        }
    };

    const onTimeBlur = () => {
        if (timeVal.trim() === "") {
            reset("time");
        } else {
            submit();
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Only blur if the submit was successful
        if (submit()) {
            blurEverything();
        }
    };

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { beatTime: !visible });
    };

    useEffect(() => {
        reset("all");
    }, [beat.value, time.value]);

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
                            onBlur={onBeatBlur}
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
                            onBlur={onTimeBlur}
                            onChange={(e) => setTimeVal(e.currentTarget.value)}
                            disabled={disabled}
                        />
                    </div>
                </div>

                <button type="submit" hidden />
            </form>
        </Panel>
    );
});

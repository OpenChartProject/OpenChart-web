import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { BPM, BPMTime } from "../../charting";
import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface BPMListItemProps {
    bpm: BPMTime;
    selected: boolean;
    onClick?(e: React.MouseEvent): void;
}

export const BPMListItem = observer((props: BPMListItemProps) => {
    let cls = "bpm-list-item";

    if (props.selected) {
        cls += " selected";
    }

    return (
        <div className={cls} onClick={props.onClick}>
            {props.bpm.bpm.value} BPM @ {props.bpm.time.value.toFixed(3)}s
        </div>
    );
});

export interface BPMListProps {
    bpms: BPMTime[];
    onSelect?(i: number): void;
}

export const BPMList = observer((props: BPMListProps) => {
    const [selected, setSelected] = useState(0);

    const onSelect = (i: number) => {
        if (props.onSelect) {
            props.onSelect(i);
        }

        setSelected(i);
    };

    return (
        <div className="bpm-list-container">
            {props.bpms.map((bpm, i) => (
                <BPMListItem
                    bpm={bpm}
                    onClick={() => onSelect(i)}
                    selected={i === selected}
                    key={bpm.time.value}
                />
            ))}
        </div>
    );
});

export interface BPMFormSubmitArgs {
    bpm: number;
    beat: number;
    time: number;
}

export interface BPMFormProps {
    bpm: BPMTime;
    disabled?: boolean;
    index: number;
    onSubmit?(args: BPMFormSubmitArgs): void;
}

export const BPMForm = observer((props: BPMFormProps) => {
    const { disabled } = props;
    const { bpm, time } = props.bpm;

    const [bpmVal, setBPMVal] = useState(bpm.value.toString());
    const [beatVal, setBeatVal] = useState(bpm.beat.value.toFixed(3));
    const [timeVal, setTimeVal] = useState(time.value.toFixed(3));

    const reset = (field: "bpm" | "beat" | "time" | "all") => {
        if (field === "bpm" || field === "all") {
            setBPMVal(bpm.value.toString());
        }

        if (field === "beat" || field === "all") {
            setBeatVal(bpm.beat.value.toFixed(3));
        }

        if (field === "time" || field === "all") {
            setTimeVal(bpm.beat.value.toFixed(3));
        }
    };

    const onCancel = () => {
        reset("all");
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (props.onSubmit) {
            props.onSubmit({
                bpm: _.toNumber(bpmVal),
                beat: _.toNumber(beatVal),
                time: _.toNumber(timeVal),
            });
        }
    };

    const onBPMBlur = () => {
        if (bpmVal.trim() === "") {
            reset("bpm");
        }
    };

    const onBeatBlur = () => {
        if (beatVal.trim() === "") {
            reset("beat");
        } else {
            setBeatVal(_.toNumber(beatVal).toFixed(3));
        }
    };

    const onTimeBlur = () => {
        if (timeVal.trim() === "") {
            reset("time");
        } else {
            setTimeVal(_.toNumber(timeVal).toFixed(3));
        }
    };

    const modified =
        bpmVal &&
        beatVal &&
        timeVal &&
        (_.toNumber(bpmVal) !== bpm.value ||
            _.toNumber(beatVal) !== bpm.beat.value ||
            _.toNumber(timeVal) !== time.value);

    return (
        <form onSubmit={onSubmit}>
            <div className="form-control">
                <label className="form-label form-label-dark">Beats per minute</label>
                <input
                    type="text"
                    className="form-input"
                    value={bpmVal}
                    onBlur={onBPMBlur}
                    onChange={(e) => setBPMVal(e.currentTarget.value)}
                    disabled={disabled}
                />
            </div>
            <div className="form-control-grid form-control-grid-half">
                <div className="form-control">
                    <label className="form-label form-label-dark">Beat</label>
                    <input
                        type="text"
                        className="form-input"
                        value={beatVal}
                        onBlur={onBeatBlur}
                        onChange={(e) => setBeatVal(e.currentTarget.value)}
                        disabled={disabled}
                    />
                </div>
                <div className="form-control">
                    <label className="form-label form-label-dark">Time</label>
                    <input
                        type="text"
                        className="form-input"
                        value={timeVal}
                        onBlur={onTimeBlur}
                        onChange={(e) => setTimeVal(e.currentTarget.value)}
                        disabled={disabled}
                    />
                </div>
            </div>
            <div className="form-control form-buttons">
                <button className="btn btn-primary btn-thin" disabled={!modified} type="submit">
                    Apply
                </button>
                <button
                    className="btn btn-secondary btn-thin float-right"
                    disabled={!modified}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
});

export interface BPMPanelProps {
    store: RootStore;
}

export const BPMPanel = observer((props: BPMPanelProps) => {
    // The index of the BPM that's currently selected in the list
    const [selected, setSelected] = useState(0);

    const { notefield, ui } = props.store;
    const chart = notefield.data.chart;
    const visible = ui.data.panelVisibility.bpm;

    const bpms = chart.bpms.getAll();
    const cur = bpms[selected];
    const disabled = notefield.data.isPlaying;

    // TODO: Move this logic into an action
    const onSubmit = (args: BPMFormSubmitArgs) => {
        const { bpm, beat, time } = args;
        let newBPM: BPM;

        try {
            if (time !== cur.time.value) {
                newBPM = new BPM(chart.bpms.beatAt(time), bpm);
            } else {
                newBPM = new BPM(beat, bpm);
            }

            chart.bpms.update(selected, newBPM);
            (document.activeElement as HTMLElement).blur();
        } catch (e) {
            ui.notify({ type: "error", msg: (e as Error).message });
        }
    };

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { bpm: !visible });
    };

    return (
        <Panel title="BPM" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">BPM List</label>
                <BPMList bpms={bpms} onSelect={(i) => setSelected(i)} />
            </div>
            <BPMForm bpm={cur} disabled={disabled} index={selected} onSubmit={onSubmit} />
        </Panel>
    );
});

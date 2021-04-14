import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { BPMTime } from "../../charting";
import _ from "lodash";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface BPMListItemProps {
    bpm: BPMTime;
    onClick?(e: React.MouseEvent): void;
}

export const BPMListItem = observer((props: BPMListItemProps) => {
    return (
        <div className="bpm-list-item" onClick={props.onClick}>
            {props.bpm.bpm.value} @ {props.bpm.time.value}s
        </div>
    );
});

export interface BPMListProps {
    bpms: BPMTime[];
    onSelect?(i: number): void;
}

export const BPMList = observer((props: BPMListProps) => {
    const onSelect = (i: number) => {
        if (props.onSelect) {
            props.onSelect(i);
        }
    };

    return (
        <div className="bpm-list-container">
            {props.bpms.map((bpm, i) => (
                <BPMListItem bpm={bpm} onClick={() => onSelect(i)} />
            ))}
        </div>
    );
});

export interface BPMFormProps {
    bpm: BPMTime;
    index: number;
}

export const BPMForm = observer((props: BPMFormProps) => {
    const { bpm, time } = props.bpm;

    const [bpmVal, setBPMVal] = useState(bpm.value);
    const [beatVal, setBeatVal] = useState(bpm.beat.value);
    const [timeVal, setTimeVal] = useState(time.value);

    const onApply = () => {};
    const onCancel = () => {};
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const modified = bpmVal !== bpm.value || beatVal !== bpm.beat.value || timeVal !== time.value;

    return (
        <form onSubmit={onSubmit}>
            <div className="form-control">
                <label className="form-label form-label-dark">Beats per minute</label>
                <input
                    type="text"
                    className="form-input"
                    value={bpmVal}
                    onChange={(e) => setBPMVal(_.toNumber(e.currentTarget.value))}
                />
            </div>
            <div className="form-control">
                <label className="form-label form-label-dark">Beat</label>
                <input
                    type="text"
                    className="form-input"
                    value={beatVal}
                    onChange={(e) => setBeatVal(_.toNumber(e.currentTarget.value))}
                />
            </div>
            <div className="form-control">
                <label className="form-label form-label-dark">Time</label>
                <input
                    type="text"
                    className="form-input"
                    value={timeVal}
                    onChange={(e) => setTimeVal(_.toNumber(e.currentTarget.value))}
                />
            </div>
            <div className="form-control">
                <button className="btn btn-primary btn-thin" disabled={!modified} onClick={onApply}>
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
    const visible = ui.data.panelVisibility.bpm;

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { bpm: !visible });
    };

    const bpms = notefield.data.chart.bpms.getBPMS();

    return (
        <Panel title="BPM" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">BPMs</label>
                <BPMList bpms={bpms} onSelect={(i) => setSelected(i)} />
            </div>
            <BPMForm bpm={bpms[selected]} index={selected} />
        </Panel>
    );
});

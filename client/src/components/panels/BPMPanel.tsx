import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { BPM, BPMTime } from "../../charting";
import { RootStore } from "../../store";
import { blurEverything } from "../../util";
import { ManagedNumberField } from "../controls";

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
    onSubmit?(args: BPMFormSubmitArgs): boolean | void;
}

export const BPMForm = observer((props: BPMFormProps) => {
    const { disabled } = props;
    const { bpm, time } = props.bpm;

    const [bpmVal, setBPMVal] = useState(bpm.value);
    const [beatVal, setBeatVal] = useState(bpm.beat.value);
    const [timeVal, setTimeVal] = useState(time.value);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (props.onSubmit) {
            const ok =
                props.onSubmit({
                    bpm: bpmVal,
                    beat: beatVal,
                    time: timeVal,
                }) !== false;

            if (ok) {
                blurEverything();
            }
        }
    };

    const modified = bpmVal !== bpm.value || beatVal !== bpm.beat.value || timeVal !== time.value;

    return (
        <form onSubmit={onSubmit}>
            <div className="form-control">
                <label className="form-label form-label-dark">Beats per minute</label>
                <ManagedNumberField
                    disabled={disabled}
                    value={bpm.value}
                    delta={0.001}
                    precision={3}
                    onValueChange={(val) => setBPMVal(val)}
                />
            </div>
            <div className="form-control-grid form-control-grid-half">
                <div className="form-control">
                    <label className="form-label form-label-dark">Beat</label>
                    <ManagedNumberField
                        disabled={disabled}
                        value={bpm.beat.value}
                        precision={3}
                        delta={0.001}
                        onValueChange={(val) => setBeatVal(val)}
                    />
                </div>
                <div className="form-control">
                    <label className="form-label form-label-dark">Time</label>
                    <ManagedNumberField
                        disabled={disabled}
                        value={time.value}
                        precision={3}
                        delta={0.001}
                        onValueChange={(val) => setTimeVal(val)}
                    />
                </div>
            </div>
            <div className="form-control form-buttons">
                <button className="btn btn-primary btn-thin" disabled={!modified} type="submit">
                    Apply
                </button>
                {/* <button
                    className="btn btn-secondary btn-thin float-right"
                    disabled={!modified}
                    onClick={onRevert}
                >
                    Revert
                </button> */}
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
    const onSubmit = (args: BPMFormSubmitArgs): boolean => {
        const { bpm, beat, time } = args;
        let newBPM: BPM;

        try {
            if (time !== cur.time.value) {
                newBPM = new BPM(chart.bpms.beatAt(time), bpm);
            } else {
                newBPM = new BPM(beat, bpm);
            }

            chart.bpms.update(selected, newBPM);
        } catch (e) {
            ui.notify({ type: "error", msg: (e as Error).message });
            return false;
        }

        return true;
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
            <div className="form-control form-buttons">
                <button type="button" className="btn btn-secondary btn-thin">
                    New BPM
                </button>
                <button type="button" className="btn btn-secondary btn-thin float-right" disabled>
                    Sync
                </button>
            </div>
            <BPMForm bpm={cur} disabled={disabled} index={selected} onSubmit={onSubmit} />
        </Panel>
    );
});

import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { BPM, BPMTime } from "../../charting";
import { RootStore } from "../../store";
import { blurEverything, fuzzyEquals, toFixed, toFixedTrim } from "../../util";
import { NumberField } from "../controls";

import { Panel } from "./Panel";

export interface BPMListItemProps {
    bpm: BPMTime;
    selected: boolean;
    showDeleteButton: boolean;
    onClick(e: React.MouseEvent): void;
    onDelete(): void;
}

/**
 * An item from the BPM list. The currently selected BPM is highlighted.
 */
export const BPMListItem = observer((props: BPMListItemProps) => {
    let cls = "bpm-list-item";

    if (props.selected) {
        cls += " selected";
    }

    const onDelete = (e: React.MouseEvent) => {
        // Prevent the list item from being selected.
        e.stopPropagation();
        props.onDelete();
    };

    return (
        <div className={cls} onClick={props.onClick}>
            {toFixedTrim(props.bpm.bpm.value, 3)} BPM @ {props.bpm.time.value.toFixed(3)}s
            {props.showDeleteButton && (
                <span
                    className="material-icons-outlined bpm-delete-btn"
                    title="Remove BPM"
                    onClick={onDelete}
                >
                    delete
                </span>
            )}
        </div>
    );
});

export interface BPMListProps {
    bpms: BPMTime[];
    index: number;
    onDelete(i: number): void;
    onSelect(i: number): void;
}

/**
 * The list of BPMs. Clicking a BPM from the list selects it.
 */
export const BPMList = observer((props: BPMListProps) => {
    const { onDelete, onSelect } = props;

    return (
        <div className="bpm-list-container">
            {props.bpms.map((bpm, i) => (
                <BPMListItem
                    bpm={bpm}
                    onClick={() => onSelect(i)}
                    onDelete={() => onDelete(i)}
                    selected={i === props.index}
                    showDeleteButton={i > 0}
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
    onSubmit(args: BPMFormSubmitArgs): boolean | void;
}

const precision = 3;

/**
 * The form for editing BPM values. This form is populated with the current
 * selected BPM.
 */
export const BPMForm = observer((props: BPMFormProps) => {
    const { disabled } = props;
    const { bpm, time } = props.bpm;

    const [bpmText, setBPMText] = useState(toFixedTrim(bpm.value, precision));
    const [bpmVal, setBPMVal] = useState(bpm.value);

    const [beatText, setBeatText] = useState(toFixed(bpm.beat.value, precision));
    const [beatVal, setBeatVal] = useState(bpm.beat.value);

    const [timeText, setTimeText] = useState(toFixed(time.value, precision));
    const [timeVal, setTimeVal] = useState(time.value);

    const onRevert = () => {
        setBPMText(toFixedTrim(bpm.value, precision));
        setBeatText(toFixed(bpm.beat.value, precision));
        setTimeText(toFixed(time.value, precision));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ok =
            props.onSubmit({
                bpm: bpmVal,
                beat: beatVal,
                time: timeVal,
            }) !== false;

        if (ok) {
            blurEverything();
        }
    };

    useEffect(() => {
        onRevert();
    }, [bpm.value, bpm.beat.value, time.value]);

    const modified =
        !disabled &&
        (!fuzzyEquals(bpmVal, bpm.value) ||
            !fuzzyEquals(beatVal, bpm.beat.value) ||
            !fuzzyEquals(timeVal, time.value));

    return (
        <form onSubmit={onSubmit}>
            <div className="form-control">
                <label className="form-label form-label-dark">Beats per minute</label>
                <NumberField
                    disabled={disabled}
                    value={bpm.value}
                    delta={0.1}
                    precision={precision}
                    text={bpmText}
                    trim={true}
                    onChange={(val) => setBPMText(val)}
                    onValueChange={(val) => setBPMVal(val)}
                />
            </div>
            <div className="form-control-grid form-control-grid-half">
                <div className="form-control">
                    <label className="form-label form-label-dark">Beat</label>
                    <NumberField
                        disabled={disabled}
                        value={bpm.beat.value}
                        precision={precision}
                        delta={0.001}
                        text={beatText}
                        onChange={(val) => setBeatText(val)}
                        onValueChange={(val) => setBeatVal(val)}
                    />
                </div>
                <div className="form-control">
                    <label className="form-label form-label-dark">Time</label>
                    <NumberField
                        disabled={disabled}
                        value={time.value}
                        precision={precision}
                        delta={0.001}
                        text={timeText}
                        onChange={(val) => setTimeText(val)}
                        onValueChange={(val) => setTimeVal(val)}
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
                    onClick={onRevert}
                >
                    Revert
                </button>
            </div>
        </form>
    );
});

export interface BPMPanelProps {
    store: RootStore;
}

/**
 * A panel for displaying and managing BPM changes.
 */
export const BPMPanel = observer((props: BPMPanelProps) => {
    const { notefield, ui } = props.store;
    const chart = notefield.data.chart;
    const { selected, visible } = ui.data.panels.bpm;

    const bpms = chart.bpms.getAll();
    const cur = bpms[selected];
    const disabled = notefield.data.isPlaying;

    const onDelete = (i: number) => {
        const count = bpms.length;
        notefield.data.chart.bpms.del(i);

        // If we had the last BPM in the list selected we're now out of bounds,
        // so decrement the selected index by 1
        if (selected === count - 1) {
            ui.selectBPM(selected - 1, false);
        }
    };

    const setSelected = (i: number) => {
        ui.selectBPM(i);
    };

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

    const onNewBPM = () => {
        try {
            const index = chart.bpms.add(new BPM(notefield.data.scroll.beat, 120));
            setSelected(index);
        } catch (e) {
            ui.notify({ type: "error", msg: (e as Error).message });
        }

        blurEverything();
    };

    // The sync feature activates the time picker. When the user picks a time on the notefield,
    // we assume that time to be 4 beats ahead. Then we calculate the time difference between
    // the picked time and where the BPM change occurs to find the new BPM.
    const onSync = () => {
        ui.activateTimePicker({
            onPick: (_, time) => {
                if (time <= cur.time.value) {
                    return;
                }

                const bpm = (60 * 4) / (time - cur.time.value);
                chart.bpms.update(selected, new BPM(cur.bpm.beat, bpm));

                ui.deactivateTimePicker();
            },
        });
    };

    const onToggle = () => {
        ui.updatePanel("bpm", { visible: !visible });
    };

    return (
        <Panel title="BPM" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">BPM List</label>
                <BPMList bpms={bpms} index={selected} onDelete={onDelete} onSelect={setSelected} />
            </div>
            <div className="form-control form-buttons">
                <button
                    type="button"
                    className="btn btn-secondary btn-thin"
                    onClick={onNewBPM}
                    disabled={disabled}
                >
                    New BPM
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-thin float-right"
                    onClick={onSync}
                    disabled={disabled}
                >
                    Sync
                </button>
            </div>
            <BPMForm bpm={cur} disabled={disabled} index={selected} onSubmit={onSubmit} />
        </Panel>
    );
});

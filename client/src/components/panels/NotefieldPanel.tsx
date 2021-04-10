import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

import { ScrollDirectionAction } from "../../actions/notefieldActions";
import { RootStore, ScrollDirection } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const NotefieldPanel = observer((props: Props) => {
    const { notefieldDisplay: nfDisplay, ui } = props.store;
    const { scrollDirection } = nfDisplay.data;

    const defaults = nfDisplay.defaults;
    const modified =
        nfDisplay.data.columnWidth !== defaults.columnWidth ||
        nfDisplay.data.receptorY !== defaults.receptorY;

    const visible = ui.data.panelVisibility.notefield;

    const onColumnWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        nfDisplay.update({ columnWidth: _.toInteger(e.target.value) });
    };

    const onReceptorPosChange = (e: ChangeEvent<HTMLInputElement>) => {
        nfDisplay.update({ receptorY: _.toInteger(e.target.value) });
    };

    const onRestore = () => {
        const { columnWidth, receptorY } = defaults;
        nfDisplay.update({ columnWidth, receptorY });
    };

    const setScrollDirection = (val: ScrollDirection) => {
        new ScrollDirectionAction(props.store, { to: val }).run();
    };

    const onToggleWaveform = (e: ChangeEvent<HTMLInputElement>) => {
        nfDisplay.update({ showWaveform: e.target.checked });
        e.target.blur();
    };

    const onToggle = () => {
        ui.updateProperty("panelVisibility", { notefield: !visible });
    };

    return (
        <Panel title="Notefield" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">Waveform</label>
                <label className="form-label-inline form-label-light">
                    <input
                        type="checkbox"
                        className="form-input"
                        checked={nfDisplay.data.showWaveform}
                        onChange={onToggleWaveform}
                    />
                    Enabled
                </label>
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Scroll Direction</label>

                <label className="form-label-inline form-label-light">
                    <input
                        className="form-input"
                        type="radio"
                        name="scroll-direction"
                        checked={scrollDirection === "up"}
                        onChange={() => setScrollDirection("up")}
                    />
                    Up
                </label>

                <label className="form-label-inline form-label-light">
                    <input
                        className="form-input"
                        type="radio"
                        name="scroll-direction"
                        checked={scrollDirection === "down"}
                        onChange={() => setScrollDirection("down")}
                    />
                    Down
                </label>
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Note Size</label>
                <input
                    className="form-input"
                    type="range"
                    title={nfDisplay.data.columnWidth + "px"}
                    min={32}
                    max={256}
                    value={nfDisplay.data.columnWidth}
                    onChange={onColumnWidthChange}
                />
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Receptor Position</label>
                <input
                    className="form-input"
                    type="range"
                    title={nfDisplay.data.receptorY + "px"}
                    min={0}
                    max={1000}
                    value={nfDisplay.data.receptorY}
                    onChange={onReceptorPosChange}
                />
            </div>

            <div className="form-control clearfix">
                <button
                    className="btn btn-secondary btn-thin float-right"
                    onClick={onRestore}
                    disabled={!modified}
                >
                    Restore Defaults
                </button>
            </div>
        </Panel>
    );
});

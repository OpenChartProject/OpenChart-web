import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

import { RootStore, ScrollDirection } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const NoteFieldPanel = observer((props: Props) => {
    const { editor, ui } = props.store;
    const defaults = editor.defaults;
    const modified =
        editor.data.columnWidth !== defaults.columnWidth ||
        editor.data.receptorY !== defaults.receptorY;

    const visible = ui.data.panelVisibility.noteField;
    const { scrollDirection } = editor.data;

    const onColumnWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        editor.update({ columnWidth: _.toInteger(e.target.value) });
    };

    const onReceptorPosChange = (e: ChangeEvent<HTMLInputElement>) => {
        editor.update({ receptorY: _.toInteger(e.target.value) });
    };

    const onRestore = () => {
        const { columnWidth, receptorY } = defaults;
        editor.update({ columnWidth, receptorY });
    };

    const setScrollDirection = (val: ScrollDirection) => {
        editor.update({ scrollDirection: val });
    };

    const onToggle = () => {
        ui.updatePanelVisibility({ noteField: !visible });
    };

    return (
        <Panel title="Notefield" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label form-label-dark">Scroll Direction</label>
                <input
                    className="form-input"
                    type="radio"
                    name="scroll-direction"
                    id="scroll-direction-up"
                    checked={scrollDirection === "up"}
                    onChange={() => setScrollDirection("up")}
                />
                <label className="form-label-inline form-label-light" htmlFor="scroll-direction-up">
                    Up
                </label>
                <input
                    className="form-input"
                    type="radio"
                    name="scroll-direction"
                    id="scroll-direction-down"
                    checked={scrollDirection === "down"}
                    onChange={() => setScrollDirection("down")}
                />
                <label
                    className="form-label-inline form-label-light"
                    htmlFor="scroll-direction-down"
                >
                    Down
                </label>
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Note Size</label>
                <input
                    className="form-input"
                    type="range"
                    title={editor.data.columnWidth + "px"}
                    min={32}
                    max={256}
                    value={editor.data.columnWidth}
                    onChange={onColumnWidthChange}
                />
            </div>

            <div className="form-control">
                <label className="form-label form-label-dark">Receptor Position</label>
                <input
                    className="form-input"
                    type="range"
                    title={editor.data.receptorY + "px"}
                    min={0}
                    max={1000}
                    value={editor.data.receptorY}
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

import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

import { RootStore } from "../../store";

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

    const visible = ui.data.panelVisibility.noteFieldSettings;

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

    const onToggle = () => {
        ui.updatePanelVisibility({ noteFieldSettings: !visible });
    };

    return (
        <Panel title="Notefield Settings" visible={visible} onToggle={onToggle}>
            <div className="form-control">
                <label className="form-label-dark">Receptor Position</label>
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

            <div className="form-control">
                <label className="form-label-dark">Note Size</label>
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

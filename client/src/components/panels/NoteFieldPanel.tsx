import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const NoteFieldPanel = observer((props: Props) => {
    const onColumnWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.store.editor.update({ columnWidth: _.toInteger(e.target.value) });
    };

    const onReceptorPosChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.store.editor.update({ receptorY: _.toInteger(e.target.value) });
    };

    return (
        <Panel title="Notefield Settings">
            <div className="form-control">
                <label className="form-label-dark">Receptor Position</label>
                <input
                    className="form-input"
                    type="range"
                    title={props.store.editor.data.receptorY + "px"}
                    min={0}
                    max={1000}
                    value={props.store.editor.data.receptorY}
                    onChange={onReceptorPosChange}
                />
            </div>

            <div className="form-control">
                <label className="form-label-dark">Note Size</label>
                <input
                    className="form-input"
                    type="range"
                    title={props.store.editor.data.columnWidth + "px"}
                    min={32}
                    max={256}
                    value={props.store.editor.data.columnWidth}
                    onChange={onColumnWidthChange}
                />
            </div>
        </Panel>
    );
});

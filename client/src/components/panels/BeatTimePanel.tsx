import { observer } from "mobx-react-lite";
import React from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const BeatTimePanel = observer((props: Props) => {
    const { noteField, ui } = props.store;
    const visible = ui.data.panelVisibility.beatTime;

    const onToggle = () => {
        ui.update({ panelVisibility: { beatTime: !visible } });
    };

    return (
        <Panel title="Beat &amp; Time" visible={visible} onToggle={onToggle}>
            <table>
                <tbody>
                    <tr>
                        <td>Beat:</td>
                        <td>{noteField.data.scroll.beat.value.toFixed(3)}</td>
                    </tr>
                    <tr>
                        <td>Time:</td>
                        <td>{noteField.data.scroll.time.value.toFixed(3)}</td>
                    </tr>
                </tbody>
            </table>
        </Panel>
    );
});

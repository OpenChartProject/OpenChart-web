import React from "react";
import { observer } from "mobx-react-lite";
import { RootStore } from "../store";
import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const SongPanel = observer((props: Props) => {
    return (
        <Panel title="Song Info">
            blah
        </Panel>
    );
});

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
            <div className="form-control">
            <label className="form-label" htmlFor="input-title">Title</label>
            <input id="input-title" type="text" className="form-input" />
            </div>


            <div className="form-control">

            <label className="form-label" htmlFor="input-artist">Artist</label>
            <input id="input-artist" type="text" className="form-input" />
            </div>
        </Panel>
    );
});

import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const SongPanel = observer((props: Props) => {
    const [artist, setArtist] = useState("");
    const [title, setTitle] = useState("");

    return (
        <Panel title="Song Info">
            <div className="form-control">
                <label className="form-label-dark" htmlFor="input-title">
                    Title
                </label>
                <input
                    id="input-title"
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
            </div>

            <div className="form-control">
                <label className="form-label-dark" htmlFor="input-artist">
                    Artist
                </label>
                <input
                    id="input-artist"
                    type="text"
                    className="form-input"
                    value={artist}
                    onChange={(e) => setArtist(e.currentTarget.value)}
                />
            </div>

            <div className="form-control">
                <button className="btn btn-thin">Apply</button>
            </div>
        </Panel>
    );
});

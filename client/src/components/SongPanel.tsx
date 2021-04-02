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

    const song = props.store.project.project.song;
    const modified = artist !== song.artist || title !== song.title;

    const onApply = () => {
        props.store.project.updateSong({ artist, title });
    }

    const onRevert = () => {
        setArtist(song.artist);
        setTitle(song.title);
    }

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
                <button className="btn btn-primary btn-thin" disabled={!modified} onClick={onApply}>Apply</button>
                <button className="btn btn-secondary btn-thin float-right" disabled={!modified} onClick={onRevert}>Revert</button>
            </div>
        </Panel>
    );
});

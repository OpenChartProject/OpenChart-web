import { observer } from "mobx-react-lite";
import React from "react";
import { RootStore } from "../store";
import { sndTick } from "../assets";

export interface Props {
    store: RootStore;
}

export const Metronome = observer(({ store }: Props) => {
    return (
        <audio src={sndTick}></audio>
    );
});

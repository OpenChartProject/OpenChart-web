import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { RootStore } from "../store/";

import { Metronome, Music, Notefield } from ".";
import {
    AudioOffsetPanel,
    AudioPanel,
    BeatTimePanel,
    BPMPanel,
    NotefieldPanel,
    PanelContainer,
    SongPanel,
} from "./panels";
import { Toolbar } from "./Toolbar";
import { WelcomeModal } from "./WelcomeModal";

export interface Props {
    store: RootStore;
}

export const App = observer((props: Props) => {
    const [showModal, setShowModal] = useState(props.store.ui.data.showWelcomeModal);
    const { store } = props;

    return (
        <div className="app-container">
            {showModal && <WelcomeModal store={store} onClose={() => setShowModal(false)} />}

            <Metronome store={store} />
            <Music store={store} />

            <Toolbar store={store} />

            <Notefield store={store} />

            <PanelContainer store={store}>
                <BeatTimePanel store={store} />
                <SongPanel store={store} />
                <BPMPanel store={store} />
                <AudioOffsetPanel store={store} />
                <AudioPanel store={store} />
                <NotefieldPanel store={store} />
            </PanelContainer>
        </div>
    );
});
